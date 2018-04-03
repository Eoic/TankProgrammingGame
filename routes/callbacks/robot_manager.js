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

    res.redirect('/dashboard');
}

// Update robot script.
exports.injectLogic = function (req, res) {

}

// Delete robot record.
exports.deleteRobot = function (req, res) {
    var name = req.body.removeRobot;
    var user = req.session.username;
    database.connection.query('SELECT * FROM Users WHERE Username = ?', user, function(err, results){
        if (err) console.log("Failed to fetch User Info")
        else{
            console.log(results[0].UserID + " " + name);
            database.connection.query('DELETE FROM Robots WHERE UserID = ? AND Name = ?', [results[0].UserID, name], function(err, results){
                if (err) {
                    console.log("We can found this robot for user: " + err);
                } else {
                    console.log("Deletion was sucessful");
                }
            })
        }
    })
    res.redirect('/dashboard');
}