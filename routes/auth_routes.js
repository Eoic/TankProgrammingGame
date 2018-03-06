var mysql = require('mysql');
var bcrypt = require('bcrypt');
var saltRounds = 5;

// Connect to database.
var connection = mysql.createConnection({
    host: '158.129.24.25',
    user: 'rq62napowN',
    password: '[[7f7372ffedjn]]',
    port: '3306',
    database: 'projekto_db'
});

connection.connect(function(error) {
    if(error)
        console.log(error);
    else 
        console.log('Connection to database is successful.');
});

exports.register = function(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash){ 
        var today = new Date();
        var users = {
            "Username": req.body.username.toLowerCase(),
            "Password": hash,
            "Registered": today,
            "Email": req.body.email
        }

        connection.query('INSERT INTO Users SET ?', users, function(error, results, fields){
            if(error){
                console.log("Error occoured.", error)
                res.send({
                    "code": 400,
                    "failed": "Error occoured." + error
                })
            } else {
                console.log("Query successful. ", results);
                res.send({
                    "code": 200,
                    "success": "User registration is successful"
                });
            }
        });
    });
}

exports.login = function(req, res){
    var username = req.body.username.toLowerCase();
    var password = req.body.password;

    connection.query('SELECT * FROM Users WHERE Username = ?', [username], function(error, results, fields){
        if(error){
            res.send({
                "code": 400,
                "failed": "Error occured: " + error
            })
        } else {
            if(results.length > 0){
                bcrypt.compare(password, results[0].Password, function(err, result){
                    if(result){                       
                        console.log("Logged in successfuly.");
                        req.session.username = username;
                        res.redirect('/');
                    }
                    else{
                        req.session.success = false;
                        res.render('login.ejs',{name: req.session.username, success: req.session.success});
                    }
                });
            } else {
                req.session.success = false;
                res.render('login.ejs',{name: req.session.username, success: req.session.success});
            }
        }
    });
}

// Disconnect from database.
exports.disconnect = function(){
    if(connection != undefined)
        connection.end();
}