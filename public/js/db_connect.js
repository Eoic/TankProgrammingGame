var mysql = require('mysql');
var connection = undefined;

// Connect to database.
exports.connect = function(host, username, password, database){
    connection = mysql.createConnection({

    });

    connection.connect(function(error) {
        if(error)
            console.log(error);
    });
}

// Make queries.
exports.query = function(query){
    if(connection == undefined)
        return;

    connection.query(query, function(err, rows){
        if(err) throw err;
        return rows;
    });
}

// Disconnect from database.
exports.disconnect = function(){
    if(connection != undefined)
        connection.end();
}