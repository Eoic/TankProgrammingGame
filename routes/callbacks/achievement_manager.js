var express = require('express');
var ruleEngine = require('json-rules-engine');
var database = require('./db_connect');

// Setup a new engine
let engine = new ruleEngine.Engine()

exports.getFromDatabase = function(req, res){
  if (req.session.username){
      database.connection.query('SELECT * FROM Achievements', function(err, result){
          if (err) res.send('An error occured =>' + err);
          else{
              res.render('./game_info/dashboard.ejs', { name: req.session.username,
                                                        pageID: 'achievements',
                                                        print: result});
          }
      })
  }
  else res.redirect('/');
}

exports.checkForAchievements = function(req, res){
  database.connection.query("SELECT * FROM Users WHERE Username = ?", req.session.username, function(error, results){
    if (error){
      console.log(error);
    }
    else{
      database.connection.query("SELECT * FROM Statistics WHERE UserID = ?", results[0].UserID, function(error, result){
        if(result.length !== 0){
          engine.addFact('Kills', result[0].Kills);
          engine.addFact('GamesWon', result[0].GamesWon);
          engine.addFact('GamesLost', result[0].GamesLost);
          engine.addFact('Deaths', result[0].Deaths);
          engine.addFact('TimePlayed', result[0].TimePlayed);
        } else {
          console.log("Unable to create achievement rules.");
        }
      })
    }
  })

  setTimeout(function(){
  engine.run()
  .then(events => {		// Function run() returns events with truthy conditions
    events.map(event => database.connection.query("SELECT UserID FROM Users WHERE Username = ?", req.session.username, function(err, result){
      if (err) 
        console.log(err);
      else{
        var achievement = {
          "UserID": result[0].UserID,
          "AchievementID": event.params.data,
          "DateEarned": new Date().toISOString().slice(0, 19).replace('T', ' ')
        }

        database.connection.query("INSERT INTO UsersAchievements (UserID, AchievementID, DateEarned) SELECT ?, ?, ? " + 
                      "WHERE NOT EXISTS ( SELECT 1 FROM UsersAchievements WHERE UserID = ? AND AchievementID = ? )",
                      [achievement.UserID, achievement.AchievementID, achievement.DateEarned, achievement.UserID, achievement.AchievementID], 
                      function(err, result){
                          if(err)	console.log(err);
                          else 		console.log("Facts loaded.");
                      });
        }
      }))
    })}, 500);

  }

//------ < Rules (Achievements) > ------
// ID = 1, Get 1 Kill
let oneKill = {
  conditions:{
    all: [{
      fact: "Kills",
      operator: 'greaterThanInclusive', // greater than value
      value: 1                       
    }]
  },
  event:{
    type: '10 Kills',
    params: {
      data: 1                          // achievement id
    }
  }
}

// ID = 2, Get 10 Kills
let tenKills = {
  conditions:{
    all: [{
      fact: "Kills",              // fact name
      operator: 'greaterThanInclusive', // greater than value
      value: 10                       
    }]
  },
  event:{
    type: '10 Kills',
    params: {
      data: 2                           // achievement id
    }
  }
}

// ID = 3, Win 1 Game
let oneGame = {
  conditions:{
    all: [{
      fact: "GamesWon",
      operator: 'greaterThanInclusive',  // greater than value
      value: 1                      
    }]
  },
  event:{
    type: '1 Won Game',
    params: {
      data: 3                          // achievement id
    }
  }
}

// ID = 4, Win 10 Games


// Don't forget to add rules to the engine!.
engine.addRule(tenKills);
engine.addRule(oneKill);
engine.addRule(oneGame);