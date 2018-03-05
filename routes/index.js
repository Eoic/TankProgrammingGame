var express = require('express');
var router = express.Router();
var db = require('../public/js/db_connect');

// GET requests.
// Routes should be split into their related files.
router.get('/', function(req, res){
    res.render('index.ejs', {name: req.session.username});          // Passing session data to index page.
});

router.get('/login.ejs', function(req, res){
    res.render('login.ejs', {name: req.session.username});          // Passing session data.
});

router.get('/register.ejs', function(req, res){
    res.render('register.ejs', {success: req.session.success, name: req.session.username});
    req.session.success = null;
});

router.get('/rankings.ejs', function(req, res){
    renderIfLogged('rankings.ejs', req, res);
});

router.get('/practice.ejs', function(req, res){
    renderIfLogged('practice.ejs', req, res);
});

router.get('/compete.ejs', function(req, res){
    renderIfLogged('compete.ejs', req, res);
});

/*
    account recovery
    */

router.get('/recovery.ejs', function(req, res){
    res.render('recovery.ejs', {name: req.session.username});        
});
/**
 * Handles user registration.
 */
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

/* Only logged user can see this page.
   Example only. 
router.get('/admin.ejs', function(req, res){
    renderIfLogged('admin.ejs', req, res);
});
*/

/**
 * Get values from login form.
 */
router.post('/login.ejs', function(req, res){
    req.session.username = req.body.username;
    res.redirect('/');
});

/**
 * Destroys user session on GET request to logout.ejs.
 */
router.get('/logout.ejs', function(req, res){
    console.log('User session destroyed.')
    req.session.destroy();
    res.redirect('/');
});

/**
 * Renders given page if user is logged in.
 * Redirects to home page otherwise.
 * @param { Page to render if user is logged in. } route 
 */
function renderIfLogged(route, req, res){
    if(req.session.username)
        res.render(route, {name: req.session.username});
    else 
        res.redirect('/');
}

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