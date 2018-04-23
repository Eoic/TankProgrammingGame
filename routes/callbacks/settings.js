const { User, sequelize } = require('./../../database');

exports.changePassword = function (req, res) {
    if (req.body.newPassword !== req.body.newPasswordRepeat) {
        res.render('./game_info/dashboard.ejs', {
            name: req.session.username,
            pageID: 'settings',
            errorMsg: "Passwords don't match!"
        });
    }
    else if(req.body.newPassword.length === 0){
        res.render('./game_info/dashboard.ejs', {
            name: req.session.username,
            pageID: 'settings',
            errorMsg: "Enter new password!"
        });
    }
    else{
        User.update({
            password: req.body.newPassword
        },{
            where: {
                username: req.session.username
            }
        }).then(() => { res.redirect('/dashboard/settings')} )
    }
}

exports.changeUsername = function (req, res){
    if (req.body.newUsernameEntry.length === 0) {
        res.render('./game_info/dashboard.ejs', {
            name: req.session.username,
            pageID: 'settings',
            errorMsg: "Enter new username!"
        });
    }
    User.update({
        username: req.body.newUsernameEntry.toLowerCase()
    }, {
        where: { username: req.session.username }
    })
    .then(() => {
        res.redirect('/dashboard/settings');
    })
    .catch(sequelize.ValidationError, (err) => {
        console.log(err);
        res.redirect('/dashboard/settings');
    })
    .catch((err) => {
        console.log(err);
        res.redirect('/dashboard/settings');
    });
}

exports.deleteUser = function(req, res){
    User.destroy({
        where: { username: req.session.username }
    }).then(() => {
        req.session.destroy();
        res.redirect('/');    
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