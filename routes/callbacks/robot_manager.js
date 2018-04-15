var database = require('./db_connect');
var { User, Robot, sequelize } = require('../../database');

// TODO: Supaprastinti catch promises.
exports.addRobot = function(req, res){
    User.findOne({
        where: { username: req.session.username }
    }).then((user) => {
        Robot.create({
            name: req.body.robot,
            userId: user.userId
        }).then(() => {
            res.redirect('/dashboard/robots');
        }).catch(sequelize.ValidationError, (err) => {
            res.render('./game_info/dashboard', { pageID: 'robots', errorMsg: err, name: req.session.username, print: []});
        }).catch((err) => {
            res.render('./game_info/dashboard', { pageID: 'robots', errorMsg: err, name: req.session.username, print: []});
        });;
    });
}

// Update robot script.
exports.injectLogic = function (req, res) {
    User.findOne({
        attributes: ['userId'],
        where: { username: req.session.username }
    }).then((user) => {
        Robot.update({
            code: req.body.code
        }, {
            where: {
                name: req.body.robotName,
                userId: user.userId
            }
        })
        .then(() => {
            res.render('./game_info/dashboard', {
                name: req.session.username,
                pageID: 'robots',
                print: []
            });
        });
    });
}

exports.getFromDatabase = function (req, res) {
    User.findOne({
        attributes: ['userId'],
        where: { username: req.session.username }
    }).then((user) => {
        Robot.findAll({
            where: { userId: user.userId },
            attributes: ['name']
        })
        .then((robots) => {
            if(robots){
                res.render('./game_info/dashboard', {
                    name: req.session.username,
                    pageID: 'robots',
                    print: robots
                });
            }
        });
    });
}

// Get robots owned by the user(names only).
exports.getNames = function (req, res) {
    User.findOne({
        where: { username: req.session.username }
    }).then((user) => {
        Robot.findAll({
            where: { userId: user.userId },
            attributes: ['name']
        })
        .then((robots) => {
            res.render('./play/practice', { print: robots, name: req.session.username });
        });
    });
}

// Delete robot record.
exports.deleteRobot = function (req, res) {
    User.findOne({
        where: { username: req.session.username },
        attributes: ['userId']
    })
    .then((user) => {
        Robot.destroy({
            where: {
                userId: user.userId,
                name: req.body.robotName
            }
        });
    })
    .catch((err) => console.log(err));
}