// Loading dependencies.
var express = require('express');
var app = express();
var router = express.Router();     
var path = require('path');
var routes = require('./routes/index');

app.use(express.static(path.join(__dirname, 'public')));

// Setting up view engine.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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