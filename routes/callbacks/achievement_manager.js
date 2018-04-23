var express = require('express');
var ruleEngine = require('json-rules-engine');
var database = require('./db_connect');
//var { User, Achievement, UserAchievement, sequelize } = require('../../database');
// Setup a new engine
let engine = new ruleEngine.Engine()

exports.getFromDatabase = function(req, res){
  /*
  User.findOne({
      attributes: ['UserId'],
      where: { username: req.session.username }
  }).then((user) => {
     UserAchievement.findAll({
        where: { userId: user.userId },
        attributes: ['achievementId', 'createdAt', 'updatedAt']
     }).then((userAchievement) =>{
          Achievement.findAll({
          attributes: ['achievementId', 'name', 'description']
        }).then((achievement, userAchievement) => {
          res.render('./game_info/dashboard', {
            name: req.session.username,
            pageID: 'achievements',
            printUserAchievements: userAchievement,
            printAchievement: achievement
          })
        })
     })
  })
  */
  
  if (req.session.username){
      database.connection.query('SELECT * FROM achievements', function(err, result){
          if (err) res.send('An error occured => 1' + err);
          else{
            database.connection.query('SELECT userId FROM users WHERE username = ?', req.session.username, function(err, result2){
              if (err) res.send('An error occured => 2' + err);
              else{
                  database.connection.query('SELECT * FROM usersachievements WHERE userId = ?', result2[0].userId, function(err, result3){
                    if (err) res.send ('An error occured => 3' + err);
                    else{
                          res.render('./game_info/dashboard.ejs', { name: req.session.username,
                            pageID: 'achievements',
                            printAchievement: result,
                            printUserAchievements: result3});
                    } 
                  })
              }
            })
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
          "DateEarned": new Date()
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
    type: '1 Kills',
    params: {
      data: 1                          // achievement id
    }
  }
}

// ID = 2, Get 10 Kills
let tenKills = {
  conditions:{
    all: [{
      fact: "Kills",                    // fact name
      operator: 'greaterThanInclusive', // greater than value
      value: 10                       
    }]
  },
  event:{
    type: '10 Kills',                   // event type
    params: {
      data: 2                           // achievement id
    }
  }
}

// ID = 3, Get 100 Kills
let hundredKill = {
  conditions:{
    all: [{
      fact: "Kills",
      operator: 'greaterThanInclusive',  
      value: 100                      
    }]
  },
  event:{
    type: '100 Kills',
    params: {
      data: 3                          
    }
  }
}

// ID = 4, Win 1 Game
let oneWin = {
  conditions:{
    all: [{
      fact: "GamesWon",
      operator: 'greaterThanInclusive',
      value: 1                       
    }]
  },
  event:{
    type: '1 Game Won',
    params: {
      data: 4                    
    }
  }
}


// ID = 5, Win 10 Games
let tenWins = {
  conditions:{
    all: [{
      fact: "GamesWon",
      operator: 'greaterThanInclusive',
      value: 10                       
    }]
  },
  event:{
    type: '10 Games Won',
    params: {
      data: 5                    
    }
  }
}
// ID = 6, Win 100 Games
let hundredWins = {
  conditions:{
    all: [{
      fact: "GamesWon",
      operator: 'greaterThanInclusive',
      value: 100                       
    }]
  },
  event:{
    type: '100 Games Won',
    params: {
      data: 6                    
    }
  }
}

// Don't forget to add rules to the engine!.
engine.addRule(oneKill);
engine.addRule(tenKills);
engine.addRule(hundredKill);
engine.addRule(oneWin);
engine.addRule(tenWins);
engine.addRule(hundredWins);