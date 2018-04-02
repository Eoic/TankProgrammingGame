/*
*   npm install json-rules-engine
*/

var express = require('express');
var ruleEngine = require('json-rules-engine');
var database = require('./db_connect');

// Setup a new engine
let engine = new ruleEngine.Engine()

/* 
 * Nezinau ar cia gerai, nes nera atskiras facts kuriamas kiekvienam zaidejui ( bent jau kiek suprantu ).
 * let facts = { accountID: ... }
 */
exports.createFacts = function(username){
  database.connection.query("SELECT * FROM Players_statistic WHERE Username = '" + username + "'", function(err, result){
    engine.addFact('Kills', result[0].Kills );
    engine.addFact('Games_won', result[0].Games_won);
    engine.addFact('Deaths', result[0].Deaths);
    engine.addFact('TimeOfPlaying', result[0].TimeOfPlaying);
  })

  // Since engine.addFacts isn't able to load fast enough, setTimeout is needed.
  console.log('Waiting for Facts to load...');
  setTimeout(function() { 
  engine.run()
  .then(events => { // run() returns events with truthy conditions
    events.map(event => database.connection.query("SELECT UserID FROM Users WHERE Username = ?", username, function(err, result){
      if (err){
        console.log(err);
      }
      else{
        var achievement = {
          "UserID": result[0].UserID,
          "AchievementID": event.params.data,
          "DateEarned": new Date().toISOString().slice(0, 19).replace('T', ' ')
        }

        // Checks if achievement is not already registered and if not - adds it.
        database.connection.query("INSERT INTO UsersAchievements (UserID, AchievementID, DateEarned) SELECT '" +
         achievement.UserID + "', '" + achievement.AchievementID + "', '" + achievement.DateEarned + "' WHERE NOT EXISTS  " +
        "( SELECT 1 FROM UsersAchievements WHERE UserID = " + achievement.UserID + " AND AchievementID = " +
        achievement.AchievementID + " )", function(err, result){
          if (err) { console.log(err); }
        });
      }
    })
    )
  })
  }, 5000);
}

exports.test = function (req, res){
  database.connection.query("SELECT * FROM Players_statistic WHERE Username = '" + req.session.username + "'", function(err, result){
    database.connection.query("UPDATE Players_statistic SET Kills = '" + (result[0].Kills + 1) + 
   "' WHERE Username = '" + req.session.username + "'", function(err,result){
      if (err) { console.log(err);
      }
      else{
        console.log("Kill added");
      }
   })
  })
}


//------ < Rules (Achievements) > ------
// ID = 1, Get 1 Kill
let oneKill = {
  conditions:{
    all: [{
      fact: 'Kills',                    // fact name
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
      fact: 'Kills',                    // fact name
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
      fact: 'Games_won',                    // fact name
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