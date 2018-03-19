var mysql = require('mysql');
var bcrypt = require('bcrypt');
var config = require('../config.js');
var saltRounds = 5;

// Connect to database.
var connection = mysql.createConnection({
    host: config.dev.database.host,
    user: config.dev.database.user,
    password: config.dev.database.password,
    port: config.dev.database.port,
    database: config.dev.database.schema
});

connection.connect(function (error) {
    if (error)
        console.log(error);
    else
        console.log('Connection to database is successful.');
});

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

            connection.query('SELECT * FROM Users WHERE Username = ?', username, function (error, results) {
                if (results.length > 0) {
                    res.render('./user/register.ejs', { usernameTaken: true });
                    console.log('Username is already taken.');
                }
                else {
                    connection.query('SELECT * FROM Users WHERE Email = ?', email, function (error, results) {
                        if (results.length > 0) {
                            res.render('./user/register.ejs', { emailTaken: true });
                            console.log('Email is already taken.');
                        }
                        else {
                            console.log('Email is not taken.');
                            connection.query('INSERT INTO Users SET ?', users, function (error, results) {
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
    
    connection.query('SELECT * FROM Users WHERE Username = ?', [username], function (error, results) {
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

exports.recovery = function (req, res) {
    var email = req.body.email;

    connection.query("SELECT Username FROM Users WHERE Email = ?", [email], function (error, results) {
        if (error) {
            res.send({
                "code": 400,
                "failed": "Error occurred: " + error
            })
        } else {
            // persiusti slaptazodi
        }
    })
}

// Disconnect from database.
exports.disconnect = function () {
    if (connection != undefined)
        connection.end();
}