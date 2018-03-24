var mysql = require('mysql');
var config = require('../../config.js');

var connection = mysql.createConnection({
    host:       config.dev.database.host,
    user:       config.dev.database.user,
    password:   config.dev.database.password,
    port:       config.dev.database.port,
    database:   config.dev.database.schema
});

connection.connect(function (error) {
    if (error) console.log(error);
    else       console.log('Connection to database is successful.');
});

// Database connection object.
exports.connection = connection;

// Disconnect from database.
exports.disconnect = function () {
    if (connection != undefined)
        connection.end();
}