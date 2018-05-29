var { User, Achievement, Statistic, sequelize } = require('../../database');

exports.getUserStatistics = function(req, res){
    User.findOne({
        attributes: [ 'userId' ],
        where: { username: req.session.username }
    }).then(user => {
        Statistic.findOne({
            where: { userId: user.userId }
        }).then(userStats => {
            if(userStats){
                res.render('./game_info/dashboard.ejs', {
                    name: req.session.username,
                    pageID: 'overview',
                    userStats: userStats
                });
            }
        });
    });
}
