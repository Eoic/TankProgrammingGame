var bcrypt = require('bcrypt');
var achievments = require('./achievement_manager');
//var nodemailer = require('nodemailer');
var database = require('./db_connect');         
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
                                    res.redirect('/');
                                    
                                    var user_stats = {
                                        "Username": username,
                                        "Kills": 0,
                                        "Deaths": 0,
                                        "GamesWon": 0,
                                        "GamesLost":0,
                                        "TimePlayed": 0
                                    }
                                    
                                    database.connection.query('INSERT INTO Statistics SET ?', user_stats, function(error, results){
                                        if (error){
                                            console.log("Error occurred.")
                                        }
                                    })
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
                        achievments.createFacts(username);  // username is needed to create facts for rule engine
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