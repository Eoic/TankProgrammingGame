var express = require('express');
var router = express.Router();
//var db = require('../public/js/db_connect');

// GET requests.
router.get('/', function(req, res){
    res.render('index.ejs');
});

router.get('/login.ejs', function(req, res){
    res.render('login.ejs', {loginSuccess: req.session.success});
    req.session.success = null;
});

router.get('/register.ejs', function(req, res){
    res.render('register.ejs', {success: req.session.success});
    req.session.success = null;
});

// POST requests.
// Registration.
router.post('/register.ejs', function(req, res){

    // Check if input is valid.
    req.check('password', 'Password is invalid.').isLength({min: 4}).
                                                  equals(req.body.confirmPassword);
    var errors = req.validationErrors();

    // If password doesn't match or too short.
    if(errors){
        req.session.errors = errors;
        req.session.success = false;
    } else {
        req.session.success = true;
    }

    res.redirect('/register.ejs');
});

// Login.
router.post('/login.ejs', function(req, res){

    // Make DB query here?
    // if(db.getUser() etc...)
    var errors = req.validationErrors();
    if(errors){
        req.session.success = false;
    } else {
        req.session.success = true;
    }
    
    res.redirect('/login.ejs');
});

module.exports = router;