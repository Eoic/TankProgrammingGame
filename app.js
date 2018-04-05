var expressValidator = require('express-validator');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var gameVM = require('./sandbox');
var express = require('express');
var config = require('./config');
var router = express.Router();     
var path = require('path');
var app = express();

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

// === VM TEST ===
gameVM.runVM();

// Creating nodejs server.
var server = app.listen(config.dev.server.port, function(){
    console.log("Server is running...");
});