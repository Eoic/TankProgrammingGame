var achievements = require('./callbacks/achievement_manager');
var authentication = require('./callbacks/authentication');
var robot_manager = require('./callbacks/robot_manager');
var settingControl = require('./callbacks/settings');
var recovery = require('./callbacks/recovery');
var player = require('./callbacks/player');
var express = require('express');
var router = express.Router();

// Test

var models = require('../models/orm');
models.connection.sync( { force: true } );

//---

// Game view pages.
router.get('/compete', loggedIn, function (req, res) {
    res.render('./play/compete', { name: req.session.username });
});

router.get('/game-screen', loggedIn, function (req, res) {
    res.render('./play/game-screen', { name: req.session.username });
});
router.get('/practice', robot_manager.getNames);
router.post('/update-robot-code', robot_manager.injectLogic);

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
        res.render('./user/register')
    }).post(authentication.register);

// Login route requests.
router.route('/login')
    .get(function (req, res) {
        res.render('./user/login');
    }).post(authentication.login);

// User folder.
router.get('/recovery', function (req, res) {
    res.render('./user/recovery');
});

/**
 * Routes to handle user registration, recovery and login.
 */
router.get('/reset/:token', recovery.token);
router.post('/recovery', recovery.recover);
router.post('/reset/:token', recovery.tokenReset);

// Setting page routes.
router.get('/delete-account', settingControl.deleteUser);
router.post('/email-update', settingControl.updateEmail);
router.post('/password-update', settingControl.changePassword);
router.post('/username-update', settingControl.changeUsername);

//Robot manager settings.
router.post('/create-robot', robot_manager.addRobot);
router.post('/delete-robot', robot_manager.deleteRobot);
router.post('/update-code', robot_manager.injectLogic);

// Take all players from DB
router.get('/rankings', player.getPlayers);

// Destroys user session on GET request to logout.
router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

function loggedIn(req, res, next) {
    if (req.session.username)
        next();
    else
        res.redirect('/');
}

// Export defined routes to app.js
module.exports = router;

