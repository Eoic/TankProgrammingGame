var socket = io();

// Execute game loop.
function execute() {
    app.ticker.start();
    setGameState(true);

    if(window.gameLoopFn){
        app.ticker.remove(window.gameLoopFn);
    }

    eval(editor.getValue());
    
    if(typeof gameLoop !== 'undefined'){
        window.gameLoopFn = gameLoop;
        app.ticker.add(gameLoop).add(gameLogic);
    }
}

function executeInVM(){
    socket.emit('run code', {
        code: obj1.x
    });
}

socket.on('server response', function(data){
    bot.x = data.result;
});

// Stop game loop.
function stopGame() {
    setGameState(false);

    if(window.gameLoop){
        app.ticker.remove(window.gameLoop);     
    }
}

// ### GAME API HERE ###
function moveAhead(distance){
    var destination = {
        x: obj1.x + distance * Math.cos(obj1.rotation),
        y: obj1.y + distance * Math.sin(obj1.rotation)
    }
    
    obj1.x += SPEED * Math.cos(obj1.rotation) * app.ticker.deltaTime;
    obj1.y += SPEED * Math.sin(obj1.rotation) * app.ticker.deltaTime;
}

function moveBack(distance){
    bot.x = bot.x - (SPEED * Math.cos(bot.rotation));
    bot.y = bot.y - (SPEED * Math.sin(bot.rotation));
}

function moveToPoint(target){
    if(target.x !== null && target.y !== null){
        
    }
}

function distanceBetweenPoints(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

