var database = require('./db_connect');

exports.getPlayer = function (req, res) {
    var newQuery = "select Kills, Deaths, GamesWon, GamesLost, Users.Username from Statistics left Join Users ON Statistics.UserID = Users.UserID order by GamesWon desc, GamesLost asc, Kills desc, Deaths asc";
    var arrayOfUsernames = new Array();
    if (req.session.username) {
        database.connection.query(newQuery, function (err, result) {
            if (err) res.send('An error occoured =>' + err);
            else {
                res.render('./game_info/rankings.ejs', { print: result });
            }
        });
    }
}