// Loading dependencies.
var express = require('express');
var app = express();
var router = express.Router();     
var path = require('path');

// Path to all website pages.
var dir = __dirname + '/views/';   

app.use(express.static(path.join(__dirname, 'public')));

// Use page router.
router.use(function(req, res, next){
    console.log("/" + req.method);
    next();
});

// --------- DEFINE PATHS HERE ----------
// GET requests.
router.get("/", function(req, res){
    res.sendFile(dir + "index.html");
});

router.get("/login.html", function(req, res){
    res.sendFile(dir + "login.html");
});

router.get("/register.html", function(req, res){
    res.sendFile(dir + "register.html");
})

// POST requests.

// --------------------------------------

// Telling router to use routes defined above.
app.use("/", router);

// Creating nodejs server.
var server = app.listen(5000, function(){
    console.log("Server is running...");
});