var express = require('express');
var router = express.Router();
//var db = require('../public/js/db_connect');

// GET requests.
router.get('/', function(req, res){
    res.render('index.ejs', {name: req.session.username});          // Passing session data to index page.
});

router.get('/login.ejs', function(req, res){
    res.render('login.ejs', {name: req.session.username});          // Passing session data.
    req.session.success = null;
});

router.get('/register.ejs', function(req, res){
    res.render('register.ejs', {success: req.session.success, name: req.session.username});
    req.session.success = null;
});

// POST requests.
// Registration.
router.post('/register.ejs', function(req, res){

    if(req.session.username)
        redirect('/');

    // Check if input is valid.
    req.check('password', 'Password is invalid.').isLength({min: 4}).
                                                  equals(req.body.confirmPassword);
    var errors = req.validationErrors();

    // If password doesn't match or too short.
    if(errors){
        req.session.success = false;
        req.session.errors = errors;
    } else {
        req.session.success = true;
        req.session.username = req.body.username;
    }

    res.redirect('/register.ejs');
});

// Only logged user can see this page.
router.get('/admin.ejs', function(req, res){
    if(req.session.username){
        res.render('admin.ejs');
    }
    else res.send('<p> You must be logged in to see this page. </p>')
});

// Login page.
router.post('/login.ejs', function(req, res){
    req.session.username = req.body.username;
    res.redirect('/');
});

// Logging out. Destroying session and redirecting to home page.
router.get('/logout.ejs', function(req, res){
    console.log('User session destroyed.')
    req.session.destroy();
    res.redirect('/');
});


// To share session data to each route.
/*
function setSharedProperties(req, data){
    if(!(data instanceof Object))
        data = {};

    data.user = req.user;
    return data;
}
*/

module.exports = router;