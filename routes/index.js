var express = require('express');
var router = express.Router();

// GET requests.
router.get('/', function(req, res){
    res.render('index.ejs');
});

router.get('/login.ejs', function(req, res){
    res.render('login.ejs');
});

router.get('/register.ejs', function(req, res){
    res.render('register.ejs', {success: req.session.success});
    req.session.success = null;
});

// POST requests.
router.post('/register.ejs', function(req, res){

    // Check if input is valid.
    req.check('password', 'Password is invalid.').isLength({min: 4}).
                                                  equals(req.body.confirmPassword);
    var errors = req.validationErrors();

    // If password doesn't match or too short.
    if(errors){
        req.session.errors = errors;
        req.session.success = false;
    } else{
        req.session.success = true;
    }
    res.redirect('/register.ejs');
});

module.exports = router;