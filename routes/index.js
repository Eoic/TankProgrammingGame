var achievements = require('./callbacks/achievement_manager');
var authentication = require('./callbacks/authentication');
var robot_manager = require('./callbacks/robot_manager');
var settingControl = require('./callbacks/settings');
var recovery = require('./callbacks/recovery');
var changeEmail = require('./callbacks/change_email');
var player = require('./callbacks/player');
var database = require('../database');
var express = require('express');
var router = express.Router();
var administrator = require('./callbacks/administration');

// Database.
database.sequelize.sync( { force: false });

// Game view pages.
router.get('/compete', loggedIn, function (req, res) {
    res.render('./play/compete', { name: req.session.username });
});

router.get('/game-screen', loggedIn, function (req, res) {
    res.render('./play/game-screen', { name: req.session.username });
});

router.get('/practice', loggedIn, robot_manager.getNames);
router.post('/update-robot-code', robot_manager.injectLogic);

// Dashboard pages.
router.get('/dashboard/overview', loggedIn, function (req, res) {
    res.render('./game_info/dashboard.ejs', {
        name: req.session.username,
        pageID: 'overview'
    });
});

router.get('/dashboard/statistics', loggedIn, function (req, res) {
    res.render('./game_info/dashboard.ejs', {
        name: req.session.username,
        pageID: 'statistics'
    });
});

router.get('/dashboard/settings', loggedIn, function (req, res) {
    res.render('./game_info/dashboard.ejs', {
        name: req.session.username,
        pageID: 'settings'
    });
});

router.get('/dashboard/robots', loggedIn, robot_manager.getFromDatabase);

router.get('/dashboard/achievements', loggedIn, achievements.checkForAchievements, achievements.getFromDatabase, function(req, res){
    res.render('./game_info/dashboard.ejs', { name: req.session.username,
        pageID: 'achievements',
        printAllAchievements: {},
        printUserAchievements: {},
        errorMsg: req.errorMsg
    });
});

// Index page.
router.get('/', function (req, res) {
    res.render('index.ejs', { name: req.session.username });
});

// Registration route requests.
router.route('/register')
    .get(function (req, res) {
        res.render('./user/register')
    }).post(authentication.registration);

// Login route requests.
router.route('/login')
    .get(function (req, res) {
        res.render('./user/login');
    }).post(authentication.login);
    
// User folder.
router.get('/recovery', function (req, res) {
    res.render('./user/recovery');
});

// Admisitration routes
router.get('/administration', loggedIn, function(req, res){
        var callback = function(call){
            if (call)
                res.render('./administration/administration', { name: req.session.username });
            else
                res.render('index.ejs', { name: req.session.username });
        }
        isAdmin(req, res, callback);
    });
router.post('/admin-robots', loggedIn, administrator.getUserFromDatabase);

router.post('/admin-delete-user', administrator.deleteUser);
router.post('/admin-delete-robot', administrator.deleteUserRobot);
router.post('/admin-alter-user', administrator.alterUser);
router.post('/admin-create-robot', administrator.addUserRobot);
/**
 * Routes to handle user registration, recovery and login.
 */
router.get('/reset/:token', recovery.token);
router.post('/recovery', recovery.recover);
router.post('/reset/:token', recovery.tokenReset);

// Setting page routes.
router.get('/delete-account', loggedIn, settingControl.deleteUser);
router.get('/change_email/:token/:email', loggedIn, changeEmail.token);
router.post('/email-update', changeEmail.recover);
router.post('/password-update', settingControl.changePassword);
router.post('/username-update', settingControl.changeUsername);


//Robot manager settings.
router.post('/create-robot', robot_manager.addRobot, robot_manager.getFromDatabase);
router.post('/delete-robot', robot_manager.deleteRobot);
router.post('/update-code', robot_manager.injectLogic);

// Take all players from DB
router.get('/rankings', loggedIn, player.getPlayers);

// Destroys user session on GET request to logout.
router.get('/logout', loggedIn, function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

// DEBUGGING 
router.get('/debug', function(req, res){
    res.render('./debugging');
})
// -------

function loggedIn(req, res, next) {
    if (req.session.username)
        next();
    else
        res.redirect('/');
}

function isAdmin(req, res, callback){
    database.User.findOne({
        attributes: ['isAdmin'],
        where: { username: req.session.username }
    }).then((user) => {
        if (user.isAdmin)
            callback(true);
        else
            callback(false);
    });
}

router.get('/practice_new/', loggedIn, robot_manager.getFromDatabasePractice);

// Export defined routes to app.js
module.exports = router;

