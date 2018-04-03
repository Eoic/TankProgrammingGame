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

router.get('/dashboard', function (req, res) {
    achievements.checkForAchievements(req, res);
    res.render('./game_info/dashboard.ejs', {
        name: req.session.username,
        body: req.param.pageId
    });
});

router.get('/dashboard/:pageId', function (req, res) {
    res.render('./game_info/dashboard.ejs', {
        name: req.session.username,
        body: req.params.pageId
    });
});

//

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

// Game info folder.
router.get(['/dashboard'], function (req, res) {
    renderPage('./game_info', req, res, true);
})

// User folder.
router.get('/index', function (req, res) { renderPage('./user', req, res, false); });
router.get('/settings', function (req, res) { renderPage('./user', req, res, true); });
router.get('/recovery', function (req, res) { renderPage('./user', req, res, false) });
router.get('/statistics', function (req, res) { renderPage('./user', req, res, true); });
//router.get('/achievements', function (req, res) { renderPage('./user', req, res, true); });
router.get('/overview', function (req, res) { renderPage('./user', req, res, true); });

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
router.post('/create-robot', robot_manager.add);
router.post('/delete-robot', robot_manager.delete);

router.get('/robots', function (req, res) {
    username = req.session.username;
    if (req.session.username) {
        database.connection.query("select Name from Robots where Owner ='" + username + "'", function (err, result) {
            if (err) res.send('An error occoured.');
            else res.render('./user/robots.ejs', { print: result });
        });
    } else res.redirect('/');
});

// Take all players from DB
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

// Take all achievements from DB
router.get('/achievements', function(req, res){
    if (req.session.username){
        database.connection.query('SELECT * FROM Achievements', function(err, result){
            if (err) res.send('An error occured =>' + err);
            else{
                res.render('./user/achievements.ejs', { print: result });
            }
        })
    }
    else res.redirect('/');
})

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