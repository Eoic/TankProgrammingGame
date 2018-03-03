// Loading dependencies.
var express = require('express');
var app = express();
var router = express.Router();      

// Path to all website pages.
var path = __dirname + '/views/';   

// Use page router.
router.use(function(req, res, next){
    console.log("/" + req.method);
    next();
});

// --------- DEFINE PATHS HERE ----------

router.get("/", function(req,res){
    res.sendFile(path + "index.html");
});

router.get("/login.html", function(req, res){
    res.sendFile(path + "login.html");
})

// --------------------------------------

// Telling router to use routes defined above.
app.use("/", router);

// Creating nodejs server.
var server = app.listen(5000, function(){
    console.log("Server is running...");
});