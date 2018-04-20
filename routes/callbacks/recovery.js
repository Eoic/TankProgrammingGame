var nodemailer = require('nodemailer');
var database = require('./db_connect');
var flash = require('express-flash');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var async = require('async');
var emailConfig = require('../../config').dev.email;
var saltRounds = 5;

exports.recover = function (req, res, next) {
            async.waterfall([
                function (done) {
                    crypto.randomBytes(20, function (err, buf) {
                        var token = buf.toString('hex');
                        done(err, token);
                    });
                },
                function (token, done) {
                    database.connection.query('SELECT * FROM users WHERE email = ?', req.body.email, function (err, results) {
                        if (results.length <= 0) {
                            return res.render('./user/recovery', { success: false });
                        }
                        var user = results[0];
                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // expires after 1 hour 
                        database.connection.query('UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?;', [token, user.resetPasswordExpires, req.body.email], function (err, results) {
                            done(err, token, user);
                        });
                    }
                    );
                },
                
                function (token, user, done) {
                    var transporter = nodemailer.createTransport({
                        service: emailConfig.service,
                        auth: {
                            user: emailConfig.user,
                            pass: emailConfig.pass
                        }
                    });
                    var mailOptions = {
                        to: user.email,
                        from: emailConfig.user,
                        subject: 'Password Reset',
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
        }

exports.token = function (req, res) {
    database.connection.query('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?', [req.params.token, Date.now()], function (err, results) {
        if (results.length <= 0) {
            return res.send(' Password reset token is invalid or has expired.');
        }
        res.render('./user/resetpassword.ejs', {
            user: req.user
        });
    })
}

exports.tokenReset = function (req, res) {
    async.waterfall([
        function (done) {
            database.connection.query('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?', [req.params.token, Date.now()], function (err, results) {
                if (results.length <= 0)
                    return res.send('Password reset token is invalid or has expired.');
                
                if (req.body.password.length < 4 || req.body.password !== req.body.passwordConfirm)
                    return res.render('./user/resetpassword.ejs', { success: false })

                var user = results[0];
                bcrypt.hash(req.body.password, saltRounds, function (err, encrypted) {
                    database.connection.query('UPDATE users SET password = ?, resetPasswordToken = null, resetPasswordExpires = null WHERE userId = ?;', [encrypted, user.userId], function (err, results_) {
                        req.session.username = user.username
                        done(err, user);
                    })
                });
            })
        },

        function (user, done) {
            var transporter = nodemailer.createTransport({
                service: emailConfig.service,
                auth: {
                    user: emailConfig.user,
                    pass: emailConfig.pass
                }
            });
            var mailOptions = {
                to: user.email,
                from: emailConfig.user,
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            transporter.sendMail(mailOptions, function (err) {
                res.render('index.ejs', { success: true, name: user.username }, function(err, html){
                });
                done(err);
            });
        }
    ], function (err) {
        res.redirect('/');
    });
}