const { User, sequelize } = require('./../../database');

exports.changePassword = function (req, res) {
    if (req.body.newPassword !== req.body.newPasswordRepeat || req.body.newPassword.length === 0){
        res.render('./game_info/dashboard', { pageID: 'settings', errorMsg: "Passwords did not match.", name: req.session.username});
    }
    else{
        User.update({
            password: req.body.newPassword
        },{
            where: {
                username: req.session.username
            }
        }).then(() => {
            res.render('./game_info/dashboard', { pageID: 'settings', message: "Password updated!", name: req.session.username});
        })
        .catch(sequelize.ValidationError, (err) => {
            res.render('./game_info/dashboard', { pageID: 'settings', errorMsg: "Password is too short.", name: req.session.username});
        })
        .catch((err) => {
            res.render('./game_info/dashboard', { pageID: 'settings', errorMsg: err, name: req.session.username});
        })
    }
}

exports.changeUsername = function (req, res){
    User.update({
        username: req.body.newUsernameEntry.toLowerCase()
    }, {
        where: { username: req.session.username }
    })
    .then(() => {
        req.session.username = req.body.newUsernameEntry;
        res.render('./game_info/dashboard', { pageID: 'settings', message: "Username Changed", name: req.session.username});
    })
    .catch(sequelize.ValidationError, (err) => {
        //console.log(err);
        res.render('./game_info/dashboard', { pageID: 'settings', errorMsg: "Username is already taken", name: req.session.username});
    })
    .catch((err) => {
        //console.log(err);
        res.render('./game_info/dashboard', { pageID: 'settings', errorMsg: err, name: req.session.username});
    });
}

exports.deleteUser = function(req, res){
    User.destroy({
        where: { username: req.session.username }
    }).then(() => {
        req.session.destroy();
        res.render('./', { deleted: true });    
    }).catch((err) => {
        console.log(err);
    });
}

// Reikia išsiųsti confirmation.
exports.updateEmail = function(req, res){
    User.update({
        email: req.body.newEmailEntry
    },{
        where: { username: req.session.username }
    })
    .then(() => {
        res.render('./game_info/dashboard', { pageID: 'settings', name: req.session.name });
    })
    .catch(sequelize.ValidationError, (err) => {
        res.render('./game_info/dashboard', { pageID: 'settings', name: req.session.name });
    });
}