var express = require('express');
var router = express.Router();

// GET requests.
router.get("/", function(req, res){
    res.render("index.ejs");
});

router.get("/login.ejs", function(req, res){
    res.render("login.ejs");
});

router.get("/register.ejs", function(req, res){
    res.render("register.ejs");
});

// POST requests.
router.post("/login.ejs", function(req, res){
    
});

module.exports = router;