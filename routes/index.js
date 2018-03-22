var authentication = require('./authentication');
var settingControl = require('./settings');
var robot_manager = require('./robot_manager');
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var async = require('async');
var database = require('./db_connect');
var nodemailer = require('nodemailer');
var bcrypt = require('bcrypt');
var flash = require('express-flash');
var saltRounds = 5;

// GET requests.
router.get('/', function (req, res) {
    res.render('index.ejs', { name: req.session.username });
});

router.get('/login', function (req, res) {
    if (!req.session.username) {                                         // Render only if not logged in
        res.render('./user/login.ejs', { name: req.session.username });  // Passing session data.
    }
    else res.redirect('/');
});

router.get('/register', function (req, res) {
    if (!req.session.username) {
        res.render('./user/register.ejs');
        req.session.success = null;
    }
    else res.redirect('/');
});

router.get('/rankings', function (req, res) {
    renderIfLogged('./game_info/rankings.ejs', req, res);
});

router.get('/practice', function (req, res) {
    renderIfLogged('./play/practice.ejs', req, res);
});

router.get('/compete', function (req, res) {
    renderIfLogged('./play/compete.ejs', req, res);
});

router.get('/dashboard', function (req, res) {
    renderIfLogged('./game_info/dashboard.ejs', req, res);
});

router.get('/settings', function (req, res) {
    renderIfLogged('./user/settings.ejs', req, res);
});

router.get('/recovery', function (req, res) {
    res.render('./user/recovery.ejs');
});

router.get('/statistics', function (req, res) {
    renderIfLogged('./user/statistics.ejs', req, res);
});

router.get('/achievements', function (req, res) {
    renderIfLogged('./user/achievements.ejs', req, res);
});

router.get('/game-screen', function (req, res) {
    res.render('./play/game-screen.ejs');
});

router.get('/overview', function (req, res) {
    renderIfLogged('./user/overview.ejs', req, res);
});

/**
 * Routes to handle user registration, recovery and login.
 */
router.post('/recovery', function (req, res, next) {
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            database.connection.query('SELECT * FROM Users WHERE Email = ?', req.body.email, function (err, results) {
                if (results.length <= 0) {
                    return res.render('./user/recovery', { success: false });
                }
                user = results[0];
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // expires after 1 hour 
                database.connection.query('UPDATE Users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE Email = ?;', [token, user.resetPasswordExpires, req.body.email], function (err, results) {
                    done(err, token, user);
                });
            }
            );
        },
        function (token, user, done) {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'badlogicgame@gmail.com',
                    pass: 'BaDlOgIc123'
                }
            });
            var mailOptions = {
                to: user.Email,
                from: 'badlogicgame@gmail.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            transporter.sendMail(mailOptions, function (err) {
                res.render('./user/recovery.ejs', { success: true });
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/recovery');
    });
});

router.get('/reset/:token', function (req, res) {
    database.connection.query('SELECT * FROM Users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?', [req.params.token, Date.now()], function (err, results) {
        if (results.length <= 0) {
            return res.send(' Password reset token is invalid or has expired.');
        }
        res.render('./user/resetpassword.ejs', {
            user: req.user
        });
    })
});

router.post('/reset/:token', function (req, res) {
    async.waterfall([
        function (done) {
            database.connection.query('SELECT * FROM Users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?', [req.params.token, Date.now()], function (err, results) {
                if (results.length <= 0) {
                    return res.send('Password reset token is invalid or has expired.');
                }
                console.log("ILGIS: " + req.body.password.length);
                if (req.body.password.length < 4 || req.body.password !== req.body.passwordConfirm) {
                    return res.render('./user/resetpassword.ejs', { success: false })
                }
                user = results[0];
                bcrypt.hash(req.body.password, saltRounds, function (err, encrypted) {
                    database.connection.query('UPDATE Users SET Password = ?, resetPasswordToken = null, resetPasswordExpires = null WHERE UserID = ?;', [encrypted, user.UserID], function (err, results_) {
                        req.session.username = user.Username
                        done(err, user);
                    })
                });
            })
        },

        function (user, done) {
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'badlogicgame@gmail.com',
                    pass: 'BaDlOgIc123'
                }
            });
            var mailOptions = {
                to: user.Email,
                from: 'badlogicgame@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.Email + ' has just been changed.\n'
            };
            transporter.sendMail(mailOptions, function (err) {
                res.render('./index.ejs', { success: true, name: user.Username });
                done(err);
            });
        }
    ], function (err) {
        res.redirect('/');
    });
});
router.post('/register', authentication.register);
router.post('/login', authentication.login);

// Setting page routes.
router.post('/email-update', settingControl.updateEmail);
router.post('/password-update', settingControl.changePassword);
router.post('/username-update', settingControl.changeUsername);
router.get('/delete-account', settingControl.deleteUser);

//Robot manager setting
router.post('/create-robot', robot_manager.add);
router.post('/delete-robot', robot_manager.delete);

router.get('/robots', function (req, res) {
    if(req.session.username){
        database.connection.query('SELECT Name FROM Robots', function (err, result) {
            if (err) res.send('An error occoured.');
            else res.render('./user/robots.ejs', {print: result});
        });
    } else res.redirect('/');
});

// Destroys user session on GET request to logout.ejs.
router.get('/logout', function (req, res) {
    console.log('User session destroyed.')
    req.session.destroy();
    res.redirect('/');
});

/**
 * Renders given page if user is logged in.
 * Redirects to home page otherwise.
 * @param { Page to render if user is logged in. } route 
 */
function renderIfLogged(route, req, res) {
    if (req.session.username)
        res.render(route, { name: req.session.username });
    else
        res.redirect('/');
}

// Export defined routes to app.js
module.exports = router; 