var bcrypt = require('bcrypt');
var { Users, Statistics, sequelize } = require('../../database');
var saltRounds = 5;

// User registration callback.
exports.registration = function(req, res){
    if(req.body.password !== req.body.confirmPassword)
        res.render('./user/register.ejs', {errorMsg: 'Passwords doesn\'t match' });

    var user = Users
    .build({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    })
    .save()
    .then(() => {
        res.render('./user/register.ejs', { success: true } );
    })
    .catch(sequelize.ValidationError, (err) => {
        res.render('./user/register.ejs', { errorMsg: err.message });
    });
}

//---------------------------------------------------
    /*
    var user = models.Users.build({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    }).catch(connection.ValidationError, function(err){
        res.render('/users/register.ejs', { errorMsg: err});
    });

    models.Users.findOne({ where: 
                            { username: user.username }  
                        });

    user.save();
    */

/*
exports.register = function (req, res) {
    if (req.body.password !== req.body.confirmPassword) {
        res.render('./user/register.ejs', { success: false })
    }
    else {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {

            models.Users.create({
                username: req.body.username.toLowerCase(),
                password: hash,
                email: req.body.email
            }).catch(error =>{
                console.log(error);
            });

            database.connection.query('SELECT * FROM Users WHERE Username = ?', username, function (error, results) {
                if (results.length > 0) {
                    res.render('./user/register.ejs', { usernameTaken: true });
                    console.log('Username is already taken.');
                }
                else {
                    database.connection.query('SELECT * FROM Users WHERE Email = ?', email, function (error, results) {
                        if (results.length > 0) {
                            res.render('./user/register.ejs', { emailTaken: true });
                            console.log('Email is already taken.');
                        }
                        else {
                            console.log('Email is not taken.');
                            database.connection.query('INSERT INTO Users SET ?', users, function (error, results) {
                                if (error) {
                                    console.log("Error occurred.", error);
                                } 
                                else{
                                    console.log("Query successful. ", results);
                                    req.session.username = username;
                                    
                                    /*
                                    *   Creating a Statistic table for an user.
                                    */
                                   /*
                                    database.connection.query('SELECT * FROM Users WHERE Username = ?', username, function(error, results){
                                        if (error){
                                            console.log("ERR = " + error);
                                        }
                                        else{
                                            var userStats = {
                                                "UserID": results[0].UserID,
                                                "Kills": 0,
                                                "Deaths": 0,
                                                "GamesWon": 0,
                                                "GamesLost": 0,
                                                "TimePlayed": 0
                                            }
                                            
                                            database.connection.query('INSERT INTO Statistics SET ?', userStats, function(error, results){
                                                if (error)
                                                    console.log("Error occurred.");
                                            });
                                        }
                                    })

                                    res.redirect('/');
                                }
                            });
                        }
                    });
                }
            });
        });
    }
}
*/
/*
exports.login = function (req, res) {
    var username = req.body.username.toLowerCase();
    var password = req.body.password;
    
    database.connection.query('SELECT * FROM Users WHERE Username = ?', [username], function (error, results) {
        if (error) {
            res.send({
                "code": 400,
                "failed": "Error occurred: " + error
            });
        } else {
            if (results.length > 0) {
                bcrypt.compare(password, results[0].Password, function (err, result) {
                    if (result) {
                        console.log("Logged in successfuly.");
                        req.session.username = username;
                        res.redirect('/');
                    }
                    else {
                        req.session.success = false;
                        res.render('./user/login.ejs', { name: req.session.username, success: req.session.success });
                    }
                });
            } else {
                req.session.success = false;
                res.render('./user/login.ejs', { name: req.session.username, success: req.session.success });
            }
        }
    });
}
*/