var authentication = require('./callbacks/authentication');
var settingControl = require('./callbacks/settings');
var robot_manager = require('./callbacks/robot_manager');
var recovery = require('./callbacks/recovery');
var express = require('express');
var router = express.Router();
var database = require('./callbacks/db_connect');
var achievements = require('./callbacks/achievement_manager');

// Play folder.
router.get(['/compete', '/practice', '/game-screen'], function (req, res) {
    renderPage('./play', req, res, false);
});

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
router.get('/index', function (req, res) { renderPage('./user', req, res, false); });
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
router.get('/delete-robot', robot_manager.deleteRobot);

// Take all players from DB
// ----------------- MOVE CALLBACK TO SEPARATE FILE -----------------------------
router.get('/rankings', function (req, res) {
    if (req.session.username) {
        database.connection.query('select * from Statistics order by GamesWon desc, GamesLost asc, Kills desc, Deaths asc', function (err, result) {
            if (err) res.send('An error occoured =>' + err);
            else {
                res.render('./game_info/rankings.ejs', { print: result });
            }
        });
    } else res.redirect('/');
});

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

