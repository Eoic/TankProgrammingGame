var database = require('./db_connect');

// Add robot record to database.
exports.add = function (req, res) {
    var insertionObject = {
        Name: req.body.robot,
        Created: new Date(),
        Code: '',
        Owner: req.session.username
    }
    database.connection.query("INSERT INTO Robots SET ?", insertionObject, function (err) {
        if (err) {
            console.log("Failed insert to DB =>" + err);
        }
    });
    res.redirect('/robots');
}

// Update robot script.
exports.injectLogic = function (req, res) {

}

// Delete robot record.
exports.delete = function (req, res) {
    var name = req.body.removeRobot;
    var user = req.session.username;
    database.connection.query("SELECT * FROM Robots WHERE Owner = '" + user + "' and Name = '" + name + "'", function (err, result) {
        if (err) {
            console.log("Can't find robot for this user =>" + err);
        } else {
            database.connection.query("DELETE FROM Robots WHERE Owner = '" + user + "' and Name = '" + name + "'", function (err) {
                if (err) {
                    console.log("we can found this robot for this user =>" + err);
                }
            })
        }
    });
}