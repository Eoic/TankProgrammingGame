var database = require('./db_connect');

// Add robot record to database.
exports.addRobot = function (req, res) {
    database.connection.query('SELECT * FROM Users WHERE Username = ?', req.session.username, function(err, results){
        if (err) console.log("Failed to grab Users Id " + err)
        else{
            var robot = {
                Name: req.body.robot,
                Created: new Date(),
                Code: '',
                UserID: results[0].UserID
            }
        
            database.connection.query("INSERT INTO Robots SET ?", robot, function (err) {
                if (err)
                    console.log("Failed insert to DB: " + err);
            });
        }
    })

    res.redirect('/dashboard/robots');
}

// Update robot script.
exports.injectLogic = function (req, res) {

}

exports.getFromDatabase = function(req, res){
    username = req.session.username;
    if (req.session.username) {
        database.connection.query("SELECT * FROM Users WHERE Username = ?", username, function(err, results){
            if (err) res.send('An error occured. ' + err);
            else{
                database.connection.query("SELECT Name FROM Robots where UserID = ?", results[0].UserID, function (err, result) {
                    if (err) res.send('An error occoured.');
                    else res.render('./game_info/dashboard.ejs', { name: req.session.username,
                                                                   pageID: 'robots',
                                                                   print: result}); 
                });
            }
        })
    } else res.redirect('/');
}

// Delete robot record.
exports.deleteRobot = function (req, res) {
    var name = req.body.robotName;
    var user = req.session.username;

    database.connection.query('SELECT UserID FROM Users WHERE Username = ?', user, function(err, results){
        if (err) console.log("Failed to fetch User Info")
        else{
            database.connection.query('DELETE FROM Robots WHERE UserID = ? AND Name = ?', [results[0].UserID, name], function(err, results){
                if (err) {
                    console.log("Error: " + err);
                } else {
                    console.log("Deletion was sucessful.");
                }
            })
        }
    })
    res.redirect('/dashboard/robots');
}