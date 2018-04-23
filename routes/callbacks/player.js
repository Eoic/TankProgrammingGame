var database = require('./db_connect');

exports.getPlayers = function (req, res) {
    var query = "SELECT statistics.userId, Kills, Deaths, GamesWon, GamesLost, Users.Username FROM Statistics LEFT JOIN " + 
                "Users ON Statistics.UserID = Users.UserID ORDER BY GamesWon DESC, GamesLost ASC, Kills " + 
                "DESC, Deaths ASC";

    if (req.session.username) {
        database.connection.query(query, function (err, result) {
            if (err) res.send('An error occoured =>' + err);
            else {
                var query1 = "SELECT * FROM robots";
                database.connection.query(query1, function(err, result1){
                    res.render('./game_info/rankings.ejs', { print: result, robots: result1, name: req.session.username });
                })
            }
        });
    } else res.redirect('/');
}