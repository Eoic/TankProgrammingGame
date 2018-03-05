// Loading dependencies.
var express = require('express');
var app = express();
var router = express.Router();     
var path = require('path');
var routes = require('./routes/index');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));

// Setting up view engine.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(expressValidator());
app.use(expressSession({
    secret: '2C44-4D44-WppQ38S',    // Secret key.
    cookie: {
        maxAge: 300000              // Session expires after 5 minutes.
    },
    saveUninitialized: false, 
    resave: false
}));

// Use page router.
router.use(function(req, res, next){
    console.log("/" + req.method);
    next();
});

// Using routes middleware/
app.use('/', routes);

// Creating nodejs server.
var server = app.listen(5000, function(){
    console.log("Server is running...");
});