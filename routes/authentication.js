var bcrypt = require('bcrypt');
var config = require('../config.js');
var nodemailer = require('nodemailer');
var database = require('./db_connect');         
var mailer = require('../config').dev.email;    // Mail service configuration.
var server = require('../config').dev.server;   // Server configuration.
var saltRounds = 5;

exports.register = function (req, res) {
    if (req.body.password !== req.body.confirmPassword) {
        res.render('./user/register.ejs', { success: false })
    }
    else {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            var today = new Date();
            var username = req.body.username.toLowerCase();
            var email = req.body.email;

            var users = {
                "Username": username,
                "Password": hash,
                "Registered": today,
                "Email": email
            }

            database.connection.query('SELECT * FROM Users WHERE Username = ?', username, function (error, results) {
                if (results.length > 0) {
                    res.render('./user/register.ejs', { usernameTaken: true });
                    console.log('Username is already taken.');
                }
                else {
                    database.connection.query('SELECT * FROM Users WHERE Email = ?', email, function (error, results) {
                        if (results.length > 0) {
                            res.render('./user/register.ejs', { emailTaken: true });
                            console.log('Email is already taken.');
                        }
                        else {
                            console.log('Email is not taken.');
                            database.connection.query('INSERT INTO Users SET ?', users, function (error, results) {
                                if (error) {
                                    console.log("Error occurred.", error);
                                } else {
                                    console.log("Query successful. ", results);
                                    req.session.username = username;
                                    res.render('./user/register.ejs', { success: true, name: req.session.username });
                                }
                            });
                        }
                    });
                }
            });
        });
    }
}

exports.login = function (req, res) {
    var username = req.body.username.toLowerCase();
    var password = req.body.password;
    
    database.connection.query('SELECT * FROM Users WHERE Username = ?', [username], function (error, results) {
        if (error) {
            res.send({
                "code": 400,
                "failed": "Error occurred: " + error
            })
        } else {
            if (results.length > 0) {
                bcrypt.compare(password, results[0].Password, function (err, result) {
                    if (result) {
                        console.log("Logged in successfuly.");
                        req.session.username = username;
                        res.redirect('/');
                    }
                    else {
                        req.session.success = false;
                        res.render('./user/login.ejs', { name: req.session.username, success: req.session.success });
                    }
                });
            } else {
                req.session.success = false;
                res.render('./user/login.ejs', { name: req.session.username, success: req.session.success });
            }
        }
    });
}

// exports.changePassword = function (req, res, email, password) {
//     connection.query('UPDATE Users SET Password = ? WHERE Email = ?',[password,email],function(err,results){

//     });
// }

exports.changePassword = function (email, password){
    connection.query('UPDATE Users SET Password = ? WHERE Email = ?',[password,email],function(err,results){
})};

var recoveryHash = '/hash';

exports.recovery = function (req, res) {
    var transporter = nodemailer.createTransport({
        service: mailer.service,
        auth: {
          user: mailer.user,
          pass: mailer.pass
        }
      });

    req.session.email = req.body.email;

    database.connection.query("SELECT * FROM Users WHERE Email = ?", [email], function (error, results) {
        if (error) {
            res.send('Something went wrong.')
        } else {
            res.send('Recovery email has been sent.');
            bcrypt.hash(results[0].Password, saltRounds, function(err, encrypted){
                var mailOptions = {
                    from: mailer.user,
                    to: email,
                    subject: 'Password recovery email.',
                    text: 'www.' + server.host + server.port + '/' + encrypted
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    let message = (error) ? error : info.response;
                    console.log(message);
                });
                recoveryHash = '/'+ encrypted;
            })
        }
    })
    console.log(recoveryHash);
}

exports.recoveryHash = recoveryHash;