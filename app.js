// Loading dependencies.
var express = require('express');
var app = express();
var router = express.Router();     
var path = require('path');

// Path to all website pages.
var dir = __dirname + '/views/';   

app.use(express.static(path.join(__dirname, 'public')));

// Setting up view engine.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use page router.
router.use(function(req, res, next){
    console.log("/" + req.method);
    next();
});

// --------- DEFINE PATHS HERE ----------
// GET requests.
router.get("/", function(req, res){
    res.render(dir + "index.ejs");
});

router.get("/login.ejs", function(req, res){
    res.render(dir + "login.ejs");
});

router.get("/register.ejs", function(req, res){
    res.render(dir + "register.ejs");
})

// POST requests.

// --------------------------------------

// Telling router to use routes defined above.
app.use("/", router);

// Creating nodejs server.
var server = app.listen(5000, function(){
    console.log("Server is running...");
});