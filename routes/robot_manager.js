var database = require('./db_connect');

// Add robot record to database.
exports.add = function (req, res) {
    var insertionObject = {
        Name: req.body.robot,
        Created: new Date(),
        Code: ''
    }
    database.connection.query("INSERT INTO Robots SET ?", insertionObject, function (err) {
        if (err) {
            console.log("Failed insert to DB =>" + err);
        }
    });
}


// Update robot script.
exports.injectLogic = function (req, res) {

}

// Delete robot record.
exports.delete = function (req, res) {

}