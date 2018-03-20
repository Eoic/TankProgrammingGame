var authentication = require('./authentication');
var settingControl = require('./settings');
var robot_manager = require('./robot_manager');
var express = require('express');
var router = express.Router();

// GET requests.
router.get('/', function(req, res){
    res.render('index.ejs', {name: req.session.username});      
});

router.get('/login', function(req, res){
    if(!req.session.username){                                         // Render only if not logged in
        res.render('./user/login.ejs', {name: req.session.username});  // Passing session data.
    }
    else res.redirect('/');        
});

router.get('/register', function(req, res){
    if(!req.session.username){  
        res.render('./user/register.ejs');
        req.session.success = null;
    }
    else res.redirect('/');
});

router.get('/rankings', function(req, res){
    renderIfLogged('./game_info/rankings.ejs', req, res);
});

router.get('/practice', function(req, res){
    renderIfLogged('./play/practice.ejs', req, res);
});

router.get('/compete', function(req, res){
    renderIfLogged('./play/compete.ejs', req, res);
});

router.get('/dashboard', function(req, res){
    renderIfLogged('./game_info/dashboard.ejs', req, res);
});

router.get('/settings', function(req, res){
    renderIfLogged('./user/settings.ejs', req, res);
});

router.get('/recovery', function(req, res){
    res.render('./user/recovery.ejs');        
});

router.get('/robots', function(req, res){
    renderIfLogged('./user/robots.ejs', req, res);
});

router.get('/statistics', function(req, res){
    renderIfLogged('./user/statistics.ejs', req, res);
});

router.get('/achievements', function(req, res){
    renderIfLogged('./user/achievements.ejs', req, res);
});

router.get('/overview', function(req, res){
    renderIfLogged('./user/overview.ejs', req, res);
});

/**
 * Routes to handle user registration and login.
 */
router.post('/recovery', authentication.recovery);
router.post('/register', authentication.register);
router.post('/login', authentication.login);

// Setting page routes.
router.post('/email-update', settingControl.updateEmail);
router.post('/password-update', settingControl.changePassword); 
router.post('/username-update', settingControl.changeUsername);
router.get('/delete-account', settingControl.deleteUser);

//Robot manager setting
router.post('/create-robot', robot_manager.add);
router.post('/delete-robot',robot_manager.delete);

// Destroys user session on GET request to logout.ejs.
router.get('/logout', function(req, res){
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

// Export defined routes to app.js
module.exports = router; 