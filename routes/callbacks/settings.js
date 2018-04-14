const { User, sequelize } = require('./../../database');

exports.changePassword = function (req, res) {
    if (req.body.newPassword !== req.body.newPasswordRepeat || req.body.newPassword.length === 0){
        res.redirect('/dashboard/settings');
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