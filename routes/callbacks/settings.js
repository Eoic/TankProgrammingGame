var database = require('./db_connect');
var bcrypt = require('bcrypt');
var saltRounds = 5;

exports.changePassword = function (req, res) {
    if (req.body.newPassword !== req.body.newPasswordRepeat || req.body.newPassword.length === 0){
        console.log("Passwords did not match or the password was too short.");
        res.redirect('/dashboard/settings');
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
            res.redirect('/dashboard/settings');
        }
        else{
            database.connection.query("UPDATE Users SET Username = '" + newUsername +"' WHERE Username = '" + oldUsername + "'", function (err, results) {
                if (err){
                    console.log("Username Update Users Error: " + err);
                }
                else{
                    console.log("Updated Users Table");
                }
            });
        }
    });
}

exports.deleteUser = function(req, res){

    database.connection.query("SELECT * FROM Users WHERE Username = ?", req.session.username, function(error, results){
        if (error){
            console.log("Failed To Grab ID of an user");
        }
        else{
            database.connection.query('DELETE FROM Statistics WHERE UserID = ?',results[0].UserID, function(error){
                if (error){
                    console.log("Failed at Statistics: " + error );
                }
                else{
                    console.log("User Statistics deleted successfully.");
                }
            })
        }
    })

    database.connection.query('DELETE FROM Users WHERE Username = ?', req.session.username, function(error){
        if(error){
            console.log("Failed: " + error);
            req.redirect('/dashboard/settings');
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
        if (results.length > 0 || newEmail.length < 8) {
            console.log('Email not available.');
            res.redirect('/dashboard/settings');
        }
        else{
            database.connection.query("UPDATE Users SET Email = '" + newEmail + "' WHERE Username = '" + req.session.username + "'", function(err, results){
                console.log("Email was changed.");
                res.redirect('/dashboard/settings');
            })
        }
    })
}