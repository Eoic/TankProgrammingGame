var bcrypt = require('bcrypt');
var { User, Statistic, sequelize } = require('../../database');

// User registration callback.
exports.registration = function(req, res){
    if(req.body.password !== req.body.confirmPassword){
        res.status(409);
        res.render('./user/register.ejs', {errorMsg: 'Passwords doesn\'t match'});
    }

    User.build({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        Statistic: { }
    },{
        include: [
            { model: Statistic }
        ]
    }).save().then(() => {
        res.render('./user/register', { success: true } );
    }).catch(sequelize.ValidationError, (err) => {
        res.status(409);
        res.render('./user/register.ejs', { errorMsg: err.message });
    }).catch((err) => {
        res.status(409);
        console.log(err);
    });
}

exports.login = function(req, res){
    User.findOne( {where: { username: req.body.username }} )
    .then(user => {
        if(user){
            bcrypt.compare(req.body.password, user.password, function(err, result){
                if(result){
                    req.session.username = user.username;
                    res.redirect('/');
                }
                else {
                    res.status(409);
                    res.render('./user/login', { errorMsg: 'Please check your password.' });
                }
            });
        } 
        else {
            res.status(409);
            res.render('./user/login', { errorMsg: 'User with this username doesn\'t exits.' } );
        }
    }).catch(err => {
        res.status(409);
        res.render('./user/login', { errorMsg: err.message });
    });
}