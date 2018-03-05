var mysql = require('mysql');
var connection = undefined;

// Connect to database.
exports.connect = function(){
    connection = mysql.createConnection({
        host: '158.129.24.25',
        user: 'rq62napowN',
        password: '[[7f7372ffedjn]]',
        port: '3306'
    });

    connection.connect(function(error) {
        if(error)
            console.log(error);
        else 
            console.log('success');
    });
}

// Make queries.
exports.query = function(){
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