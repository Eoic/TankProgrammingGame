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
                    database.connection.query('SELECT * FROM users WHERE username = ?', req.session.username, function (err, results) {
                        console.log('name:' + req.session.username);
                        if (results.length <= 0) {
                            console.log('no results' + req.body.newEmailEntry);
                            return res.render('./game_info/dashboard.ejs', { success: false, name: req.session.username, pageID: 'settings' });
                        }
                        user = results[0];
                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // expires after 1 hour 
                        database.connection.query('UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?;', [token, user.resetPasswordExpires, user.email], function (err, results) {
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
                        subject: 'Confirmation of email change',
                        text: 'You are receiving this because you (or someone else) have requested the change of the email for your account.\n\n' +
                            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                            'http://' + req.headers.host + '/change_email/' + token + '/' + req.body.newEmailEntry + '\n\n' +
                            'If you did not request this, please ignore this email and your email will remain unchanged.\n'
                    };
                    transporter.sendMail(mailOptions, function (err) {
                        //res.render('./user/settings.ejs', { success: true });
                        res.render('./game_info/dashboard.ejs',{name: req.session.name, pageID: 'settings', message: 'Confirm changing your email by clicking on the link sent to your current email'});
                        done(err, 'done');
                    });
                }
            ], function (err) {
                if (err) return next(err);
                res.render('./game_info/dashboard.ejs',{name: req.session.username, pageID: 'settings', errMsg: 'Oops, something went wrong!'});
            });
        }

exports.token = function (req, res) {

    database.connection.query('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?', [req.params.token, Date.now()], function (err, results) {

    if (results.length <= 0) {
            return res.send(' Password reset token is invalid or has expired.');
        }
        res.render('./user/settings.ejs', {user: req.session.username},function(err , html){
            database.connection.query('SELECT * FROM users WHERE username = ?', [req.session.username], function(err, results){
                if(results.length <= 0 ){
                    console.error(err);
                }  
                else{
                    user = results[0];
                    database.connection.query('UPDATE users SET email = ? WHERE userId = ?;',[req.params.email, user.userId],function(err,results,fields){
                        if(err){
                            console.error(err);
                        } 
                        else{
                            res.render('./game_info/dashboard.ejs',{name: req.session.username, pageID: 'settings', message: 'Your email has been changed'});
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
                                subject: 'Email changed',
                                text: 'Your email has been changed to: ' + req.params.email
                            };
                            transporter.sendMail(mailOptions);
                        }
                    })

                }              
            })})})}