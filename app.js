var expressValidator = require('express-validator');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var express = require('express');
var config = require('./config');
var router = express.Router();  
var path = require('path');
var app = express();
var loopLimit = 0;

const SPEED = 2;

var server = require('http').Server(app);
var io = require('socket.io')(server);

// Setting up static path for css, js and images.
app.use(express.static(path.join(__dirname + "/public")));

// Setting up view engine.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// HTTP Headers.
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
 
// User session.
app.use(expressSession({
    secret: config.dev.session.key,    
    cookie: {
        maxAge: config.dev.session.age
    },
    saveUninitialized: false, 
    resave: false
}));

// Using routes middleware.
app.use('/', routes);

// Creating NodeJS server.
server.listen(config.dev.server.port, () => console.log('Server runnning'));

// Game functions.
function radToDeg(rotation){
    return ((rotation * 180) / Math.PI) % 360;
}

/* -- SocketIO setup -- */
var gameCollection = new function(){
    this.totalGameCount = 0;
    this.gameList = []
};

function gameSeeker(socket){
    loopLimit++;
    if((gameCollection.totalGameCount == 0) || (loopLimit >= 20)){
        buildGame(socket);
        loopLimit = 0;
    } else {
        var randomPick = Math.floor(Math.random() * gameCollection.totalGameCount);
        if(gameCollection.gameList[randomPick]['gameObject']['playerTwo'] == null){
            gameCollection.gameList[randomPick]['gameObject']['playerTwo'] = socket.username;

            socket.emit('joinSuccess', {
                gameId: gameCollection.gameList[randomPick]['gameObject']['id'],
                username: gameCollection.gameList[randomPick]['gameObject']['playerTwo'],
                host: gameCollection.gameList[randomPick]['gameObject']['playerOne']
            });

            socket.broadcast.emit('gameReady', {
                data: gameCollection.gameList[randomPick]['gameObject']
            });

            console.log(socket.username + " has been added to " + gameCollection.gameList[randomPick]['gameObject']['id']);
        } else {
            gameSeeker(socket);
        }
    }
}

function buildGame(socket){
    var gameObject = {};
    gameObject.id = (Math.random() + 1).toString(36).slice(2, 18);
    gameObject.playerOne = socket.username;
    gameObject.playerTwo = null;
    gameCollection.totalGameCount++;
    gameCollection.gameList.push({gameObject});

    console.log("Game created by " + socket.username + " with " + gameObject.id);
    
    io.emit('gameCreated', {
        username: socket.username,
        gameId: gameObject.id
    });
}

function destroyGame(socket){
    var notInGame = true;

    for(var i = 0; i < gameCollection.totalGameCount; i++){
        var gameId = gameCollection.gameList[i]['gameObject']['id'];
        var p1 = gameCollection.gameList[i]['gameObject']['playerOne'];
        var p2 = gameCollection.gameList[i]['gameObject']['playerTwo'];

        if(p1 === socket.username){
            gameCollection.totalGameCount--;
            console.log("Destroying game " + gameId);
            gameCollection.gameList.splice(i, 1);
            console.log(gameCollection.gameList);
            socket.emit('leftGame', { gameId: gameId} );
            io.emit('gameDestroyed', {gameId: gameId, gameOwner: socket.username });
            notInGame = false;
        } else if(p2 === socket.username){
            gameCollection.gameList[i]['gameObject']['playerTwo'] = null;
            console.log(socket.username + ' has left ' + gameId);
            socket.emit('leftGame', { gameId: gameId });
            console.log(gameCollection.gameList[i]['gameObject']);
            notInGame = false;
        }
    }

    if(notInGame === true)
        socket.emit('notInGame');
}

var playersCount = 0;

io.on('connection', function(socket){

    /* Move bot ahead. */
    socket.on('move ahead', (data) => {
        data.posX += SPEED * Math.cos(data.rot) * data.delta;
        data.posY += SPEED * Math.sin(data.rot) * data.delta;

        socket.emit('move response', {
            posX: data.posX,
            posY: data.posY
        });
    });

    /* Move bot back. */
    socket.on('move back', (data) => {
        data.posX -= SPEED * Math.cos(data.rot) * data.delta;
        data.posY -= SPEED * Math.sin(data.rot) * data.delta;

        socket.emit('move response', {
            posX: data.posX,
            posY: data.posY
        });
    });

    /* Rotate bot turret. */
    socket.on('rotate turret', (data) => {
    
        data.rot += 0.1 * data.delta;

        socket.emit('rotate turret resp', {
            rot: data.rot
        });
    });

    /*  Rotate bot */
    socket.on('rotate', (data) => {

        var turn = 0.1 * data.delta;
        data.rot += (data.deg - radToDeg(data.rot)) ? turn : -turn;
        
        console.log(data.rot);

        if(Math.abs(data.deg - radToDeg(data.rot)) > 2){
            socket.emit('rotate resp', {
                rot: data.rot
            });
        }
    });

    console.log('SocketIO connection successful.');
    var userAdded = false;

    socket.on('add user', function(username){
        if(userAdded)
            return;

        socket.username = username;
        playersCount++;
        userAdded = true;

        socket.emit('login', {
            playersCount: playersCount
        });

        socket.broadcast.emit('player joined', {
            username: socket.username,
            playersCount: playersCount
        });
    });

    socket.on('disconnect', function(){
        if(userAdded){
            playersCount--;
            destroyGame(socket);

            socket.broadcast.emit('player left', {
                username: socket.username,
                playersCount: playersCount
            });
        }
    });

    socket.on('joinGame', function(){
        console.log(socket.username + " wants to join the game.");
        var alreadyInGame = false;
        
        for(var i = 0; i < gameCollection.totalGameCount; i++){
            var p1 = gameCollection.gameList[i]['gameObject']['playerOne'];
            var p2 = gameCollection.gameList[i]['gameObject']['playerTwo'];

            if (p1 === socket.username || p2 === socket.username){
              alreadyInGame = true;
              console.log(socket.username + " already has a Game!");
              
              socket.emit('alreadyJoined', {
                gameId: gameCollection.gameList[i]['gameObject']['id']
              });
            }
        }

        if(alreadyInGame == false){
            gameSeeker(socket);
        }
    });

    socket.on('leaveGame', function(){
        if(gameCollection.totalGameCount == 0){
            socket.emit('notInGame');
        } else{
            destroyGame(socket);
        }
    });
});

module.exports = app;