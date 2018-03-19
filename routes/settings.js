var mysql = require('mysql');
var bcrypt = require('bcrypt');
var config = require('../config.js');
var saltRounds = 5;

//tikriausiai ne taip reik
var connection = mysql.createConnection({
    host: config.dev.database.host,
    user: config.dev.database.user,
    password: config.dev.database.password,
    port: config.dev.database.port,
    database: config.dev.database.schema
});

exports.changePassword = function (req, res) {
    if ( req.body.newPassword !== req.body.newPasswordRepeat ){
        console.log("Passwords did not match.");
        res.redirect('/dashboard');
    }
    else{
        bcrypt.hash(req.body.newPassword, saltRounds, function(err, hash) {
            if (err) return next(err);
            connection.query("UPDATE Users SET Password = '" + hash +"' WHERE Username = '" + req.session.username + "'", 
            function (err, result) {
                console.log(result.affectedRows + " record(s) updated");
                res.redirect('/logout');
            });
        });
    }
}

exports.changeUsername = function (req, res){
    var newUsername = req.body.newUsernameEntry.toLowerCase();

    connection.query('SELECT * FROM Users WHERE Username = ?', newUsername, function (error, results) {
        if (results.length > 0) {
            console.log('Username is already taken.');
        }
        else{
            connection.query("UPDATE Users SET Username = '" + newUsername +"' WHERE Username = '" + req.session.username + "'", 
                            function (err, result) {
                console.log(result.affectedRows + " record(s) updated");
                req.session.username = newUsername;
               // res.redirect('/settings');
                res.redirect('/dashboard');
            });
        }
    });
}