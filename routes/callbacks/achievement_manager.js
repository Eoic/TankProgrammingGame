var express = require('express');
var ruleEngine = require('json-rules-engine');
var database = require('./db_connect');
var { User, Achievement, Statistic, sequelize } = require('../../database');
let engine = new ruleEngine.Engine()

exports.getFromDatabase = function(req, res, next){
	User.find({
		attributes: ['userId'],
		where: { username: req.session.username},
		include: [{ 
			model: Achievement,
			attributes: ['achievementId'],
			through: { attributes: [] }
		}]
	}).then(unlockedAchievements => {
		Achievement.findAll({}).then(allAchiements => {
			res.render('./game_info/dashboard.ejs', { name: req.session.username,
				pageID: 'achievements',
				printAllAchievements: allAchiements,
				printUserAchievements: unlockedAchievements.Achievements
			});
		});
	}).catch(err => {
		req.errorMsg = err;
		next();
	});
}


exports.checkForAchievements = function(req, res, next){
	User.findOne({
		attributes: [ 'userId' ],
		where: { username: req.session.username }
	}).then(user => {
		Statistic.findOne({
			where: { userId: user.userId }
		}).then(userStats => {
			if(userStats){
				engine.addFact('Kills', userStats.kills);
				engine.addFact('GamesWon', userStats.gamesWon);
				engine.addFact('GamesLost', userStats.gamesLost);
				engine.addFact('Deaths', userStats.deaths);

				setTimeout(function() {
					engine.run().then(events => {
						events.map(event => {
							user.hasAchievements([user.userId, event.params.data]).then(res => {
								console.log('whatever');
							});
						});
					}).then(() => next());
				}, 100);
			}
		});
	});
}

//------ Achievement rules ------

// ID = 1, Get 1 Kill
let oneKill = {
  conditions: {
    all: [{
      fact: "Kills",
      operator: 'greaterThanInclusive',
      value: 1                       
    }]
  },
  event:{
    type: '1 Kills',
    params: {
      data: 1                          
    }
  }
}

// ID = 2, Get 10 Kills
let tenKills = {
  conditions:{
    all: [{
		fact: "Kills",                    
		operator: 'greaterThanInclusive', 
		value: 10                      
    }]
  },
  event:{
    type: '10 Kills',                   
    params: {
		data: 2                        
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