var authentication = require('./callbacks/authentication');
var settingControl = require('./callbacks/settings');
var robot_manager = require('./callbacks/robot_manager');
var recovery = require('./callbacks/recovery');
var express = require('express');
var router = express.Router();
var database = require('./callbacks/db_connect');

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

// Play folder.
router.get(['/compete', '/practice', '/game-screen'], function (req, res) {
    renderPage('./play', req, res, false);
});

// Game info folder.
router.get(['/dashboard'], function (req, res) {
    renderPage('./game_info', req, res, true);
})

// User folder.
router.get('/index', function (req, res) { renderPage('./user', req, res, false); });
router.get('/settings', function (req, res) { renderPage('./user', req, res, true); });
router.get('/recovery', function (req, res) { renderPage('./user', req, res, false) });
router.get('/statistics', function (req, res) { renderPage('./user', req, res, true); });
router.get('/achievements', function (req, res) { renderPage('./user', req, res, true); });
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
    if (req.session.username) {
        database.connection.query('SELECT Name FROM Robots', function (err, result) {
            if (err) res.send('An error occoured.');
            else res.render('./user/robots.ejs', { print: result });
        });
    } else res.redirect('/');
});

const newLocal = './game_info/rankings.ejs';
//take all players from DB
router.get('/rankings', function (req, res) {
    if (req.session.username) {
        database.connection.query('select * from Players_statistic ORDER BY Games_won DESC, Kills DESC, Deaths ASC', function (err, result) {
            if (err) res.send('An error occoured =>'+ err);
            else {
                res.render(newLocal, { print: result });
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