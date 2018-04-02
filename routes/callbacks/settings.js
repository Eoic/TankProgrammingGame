var database = require('./db_connect');
var bcrypt = require('bcrypt');
var saltRounds = 5;

exports.changePassword = function (req, res) {
    if (req.body.newPassword !== req.body.newPasswordRepeat){
        console.log("Passwords did not match.");
        res.redirect('/dashboard');
    }
    else{
        bcrypt.hash(req.body.newPassword, saltRounds, function(err, hash) {
            if (err) return next(err);
            database.connection.query("UPDATE Users SET Password = '" + hash +"' WHERE Username = '" + req.session.username + "'", 
            
            function (err, result) {
                console.log(result.affectedRows + " record(s) updated");
                res.redirect('/logout');
            });
        });
    }
}

exports.changeUsername = function (req, res){
    var newUsername = req.body.newUsernameEntry.toLowerCase();

    database.connection.query('SELECT * FROM Users WHERE Username = ?', newUsername, function (error, results) {
        if (results.length > 0 || req.session.newPassword === newUsername) {
            console.log('Username not available.');
            res.redirect('/dashboard');
        }
        else{
            database.connection.query("UPDATE Users SET Username = '" + newUsername +"' WHERE Username = '" + req.session.username + "'", function (err, result) {
                console.log(result.affectedRows + " record(s) updated");
                req.session.username = newUsername;
                res.redirect('/dashboard');
            });
        }
    });
}

exports.deleteUser = function(req, res){
    database.connection.query('DELETE FROM Users WHERE Username = ?', req.session.username, function(error){
        if(error){
            console.log("Failed: " + error);
            req.redirect('/dashboard');
        }
        else {
            console.log("User deleted successfully.");
            req.session.destroy();
            res.redirect('/');
        }
    });
}

exports.updateEmail = function(req, res){
    
}