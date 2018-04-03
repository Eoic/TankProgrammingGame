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
    var oldUsername = req.session.username;
    database.connection.query('SELECT * FROM Users WHERE Username = ?', newUsername, function (error, results) {
        if (results.length > 0) {
            console.log('Username not available.');
            res.redirect('/dashboard');
        }
        else{
            database.connection.query("SET FOREIGN_KEY_CHECKS = 0");
            database.connection.query("UPDATE Users SET Username = '" + newUsername +"' WHERE Username = '" + oldUsername + "'", function (err, results) {
                if (err){
                    console.log("Username Update Users Error: " + err);
                }
                else{
                    console.log("Updated Users Table");
                }
            });
            
            database.connection.query("UPDATE Statistics SET Username = '" + newUsername + "' WHERE Username = '" + oldUsername + "'", function(err,results){
                if (err) {
                    console.log("Username Update Statistics Error: " + err);
                }
                else{
                    console.log("Updated Statistics Table");
                    req.session.username = newUsername;
                    res.redirect('/dashboard');
                }
            })
            database.connection.query("SET FOREIGN_KEY_CHECKS = 1");
        }
    });
}

exports.deleteUser = function(req, res){
    database.connection.query('DELETE FROM Statistics WHERE Username = ?', req.session.username, function(error){
        if (error){
            console.log("Failed at Statistics: " + error );
        }
        else{
            console.log("Statistics deleted successfully.");
        }
    })

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
    var newEmail = req.body.newEmailEntry;
    
    database.connection.query('SELECT * FROM Users Where Email = ?',  newEmail, function (error, results) {
        if (results.length > 0) {
            console.log('Email not available.');
            res.redirect('/dashboard');
        }
        else{
            database.connection.query("UPDATE Users SET Email = '" + newEmail + "' WHERE Username = '" + req.session.username + "'", function(err, results){
                console.log("Email was changed.");
                res.redirect('/dashboard');
            })
        }
    })
}