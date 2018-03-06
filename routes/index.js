var authentication = require('./auth_routes');
var express = require('express');
var router = express.Router();

// GET requests.
// Routes should be split into their related files.
router.get('/', function(req, res){
    res.render('index.ejs', {name: req.session.username});          // Passing session data to index page.
});

router.get('/login.ejs', function(req, res){
    if(!req.session.username){  //render only if not logged in
        res.render('login.ejs', {name: req.session.username});// Passing session data.
    }
    else{
        res.redirect('/');
    }          
});

router.get('/register.ejs', function(req, res){
    if(!req.session.username){  //render only if not logged in
        res.render('register.ejs');
        req.session.success = null;
    }
    else{
        res.redirect('/');
    }
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

router.get('/dashboard.ejs', function(req, res){
    renderIfLogged('dashboard.ejs', req, res);
});

router.get('/settings.ejs', function(req, res){
    renderIfLogged('settings.ejs', req, res);
});

router.get('/recovery.ejs', function(req, res){
    res.render('recovery.ejs', {name: req.session.username});        
});

// Route to handle user registration.
router.post('/register.ejs', authentication.register);
router.post('/login.ejs', authentication.login);

/**
 * Handles user registration.
 */
/*
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
/*
router.post('/login.ejs', function(req, res){
    req.session.username = req.body.username;
    res.redirect('/');
});
*/

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
