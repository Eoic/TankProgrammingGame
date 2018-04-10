var achievements = require('./callbacks/achievement_manager');
var authentication = require('./callbacks/authentication');
var robot_manager = require('./callbacks/robot_manager');
var settingControl = require('./callbacks/settings');
var database = require('./callbacks/db_connect');
var recovery = require('./callbacks/recovery');
var player = require('./callbacks/player');
var express = require('express');
var router = express.Router();

// Game view.
/*router.post('/practice', function(req, res){*/
    /* TODO:    RUN
                1. Get code from editor.
                2. Run through VM.
                3. Success -> let code run in the brouser.

                SAVE
                1. Query to DB. (robot_manager.injectLogic(req.body.code))
    */ 
/*});*/

// Play folder.
router.get(['/compete', '/game-screen'], function (req, res) {
    renderPage('./play', req, res, false);
});
router.get('/practice', robot_manager.getNames);

// Dashboard pages.
router.get('/dashboard/overview', function (req, res) {
    res.render('./game_info/dashboard.ejs', {
        name: req.session.username,
        pageID: 'overview'
    });
});

router.get('/dashboard/statistics', function (req, res) {
    res.render('./game_info/dashboard.ejs', {
        name: req.session.username,
        pageID: 'statistics'
    });
});

router.get('/dashboard/settings', function (req, res) {
    res.render('./game_info/dashboard.ejs', {
        name: req.session.username,
        pageID: 'settings'
    });
});

router.get('/dashboard/robots', robot_manager.getFromDatabase);
router.get('/dashboard/achievements', achievements.getFromDatabase);


// Index page.
router.get('/', function (req, res) {
    res.render('index.ejs', { name: req.session.username });
});

// Registration route requests.
router.route('/register')
    .get(function (req, res) {
        renderPage('./user', req, res, false);
    }).post(authentication.register);

// Login route requests.
router.route('/login')
    .get(function (req, res) {
        renderPage('./user', req, res, false);
    }).post(authentication.login);

// User folder.
router.get('/recovery', function (req, res) { renderPage('./user', req, res, false) });

/**
 * Routes to handle user registration, recovery and login.
 */
router.post('/recovery', recovery.recover);
router.get('/reset/:token', recovery.token);
router.post('/reset/:token', recovery.tokenReset);

// Setting page routes.
router.post('/email-update', settingControl.updateEmail);
router.post('/password-update', settingControl.changePassword);
router.post('/username-update', settingControl.changeUsername);
router.get('/delete-account', settingControl.deleteUser);

//Robot manager settings.
router.post('/create-robot', robot_manager.addRobot);
router.post('/delete-robot', robot_manager.deleteRobot);
router.post('/update-code',robot_manager.injectLogic);

// Take all players from DB
router.get('/rankings', player.getPlayers);

// Destroys user session on GET request to logout.
router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

/**
 * Render page to user.
 * @param {*} route Page path. 
 * @param { Should user be logged in to view page. } toAuthenticatedUser 
 */
function renderPage(folder, req, res, toAuthenticatedUser) {
    if (toAuthenticatedUser) {
        if (req.session.username)
            res.render(folder.concat(req.path), { name: req.session.username });
        else res.redirect('/');
    }
    else res.render(folder.concat(req.path));
}

// Export defined routes to app.js
module.exports = router;

