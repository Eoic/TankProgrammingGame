var database = require('./db_connect');

exports.getPlayers = function (req, res) {
    var query = "SELECT Kills, Deaths, GamesWon, GamesLost, Users.Username FROM Statistics LEFT JOIN " + 
                "Users ON Statistics.UserID = Users.UserID ORDER BY GamesWon DESC, GamesLost ASC, Kills " + 
                "DESC, Deaths ASC";

    if (req.session.username) {
        database.connection.query(query, function (err, result) {
            if (err) res.send('An error occoured =>' + err);
            else {
                res.render('./game_info/rankings.ejs', { print: result, name: req.session.username });
            }
        });
    } else res.redirect('/');
}