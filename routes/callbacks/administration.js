var { User, Statistic, Robot, sequelize } = require('../../database');

exports.getUserFromDatabase = function (req, res) {
    User.findOne({
        attributes: ['userId'],
        where: { username: req.body.usernameRobot }
    }).then((user) => {
        Robot.findAll({
            where: { userId: user.userId },
            attributes: ['name', 'health', 'energy', 'level', 'experience', 'attributePoints', 'kills', 'deaths']
        })
        .then((robots) => {
            res.render('./administration/admin_robots.ejs', {
                name: req.session.username,
                editUser: req.body.usernameRobot,
                print: robots
            });
        })
    }).catch((err) => {
        res.render('./administration/administration.ejs', 
        {   name: req.session.username, 
            msg: err,
            success: false 
        })
    });;
}

exports.deleteUser = function(req, res){
    User.destroy({
        where: { username: req.body.deleteUserEntry }
    }).then(function(wasDeleted){
        // No users were removed
        if (wasDeleted == 0){
            res.render('./administration/administration.ejs',
            {   name: req.session.username, 
                msg: "User \"" + req.body.deleteUserEntry + "\" Does Not Exist",
                success: false
            });   
        }
        else if (wasDeleted == 1){
            res.render('./administration/administration.ejs',
            {   name: req.session.username, 
                msg: "User \"" + req.body.deleteUserEntry + "\" Was Removed Succesfully",
                success: true 
            });   
        }
    }).catch((err) => {
        res.render('./administration/administration.ejs', 
        {   name: req.session.username, 
            msg: err,
            success: false 
        });   
    });
}

exports.alterUser = function(req, res){
    userToUpdate = req.body.alterUserEntry;
    fieldToUpdate = req.body.selectedColumn;
    changeValueTo = req.body.alterUserAmount;

    User.findOne({
        where: { username: userToUpdate }
    }).then((user) =>{
        Statistic.update(
            {
                [fieldToUpdate]: changeValueTo
            },
            {
                where:
                {
                    userId: user.userId
                }
            }
        ).then(function(wasUpdated){
            if (wasUpdated == 1){
                res.render('./administration/administration.ejs', 
                {   name: req.session.username, 
                    msg: "Field \"" + fieldToUpdate + "\" For User \"" + userToUpdate + "\" Was Updated To " + changeValueTo,
                    success: true 
                });  
            }
            else if (wasUpdated == 0){
                res.render('./administration/administration.ejs', 
                {   name: req.session.username, 
                    msg: "\"" + userToUpdate + "\" Does Not Exists Or The Field \""  +  fieldToUpdate + "\" Already Matches The Value Of " + changeValueTo,
                    success: false 
                });  
            }
        }).catch((err) => {
            res.render('./administration/administration.ejs', 
            {   name: req.session.username, 
                msg: err,
                success: false 
            });  
        })
    })
}

exports.deleteUserRobot = function(req, res){
    /*
    console.log("Vardas: " + req.body.editUser)
    console.log("---------------------------");
    console.log("Robotas: " + req.body.robotName);
    console.log("---------------------------");
    */
    User.findOne({
        where: { username: req.body.editUser },
        attributes: ['userId']
    })
    .then((user) => {
        Robot.destroy({
            where: {
                userId: user.userId,
                name: req.body.robotName
            }
        })/*.then(function(wasDeleted){
            console.log(wasDeleted);
        });*/
    })
    .catch((err) => console.log(err));
}

exports.addUserRobot = function(req, res, next){
    const admins = [ 'asdasd', 'true'];
    User.findOne({
        where: { username: req.body.editUser }
    }).then((user) => {
        Robot.create({
            name: req.body.robotName,
            userId: user.userId
        }).catch(sequelize.ValidationError, (err) => {
            req.errorMsg = err;
            next();
        }).catch((err) => {
            req.errorMsg = err;
            next();
        });;
    });
}