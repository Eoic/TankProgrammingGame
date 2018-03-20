var database = require('./db_connect');

// Add robot record to database.
exports.add = function (req, res) {
    var name = req.body.robot;
    var date = new Date();
    database.connection.query("INSERT INTO Robots(RobotID,Name,Created,Code) VALUES ('3','dsadf','0001-01-01 00-11-03',NULL)", function (err) {
        if (err) {
            console.log("Failed insert to DB" + err);
            req.redirect("/robots");
        }
    });
}

// Update robot script.
exports.injectLogic = function (req, res) {

}

// Delete robot record.
exports.delete = function (req, res) {

}