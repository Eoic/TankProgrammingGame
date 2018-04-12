var Sequelize = require('sequelize');
var config = require('../config').dev.database;

const connection = new Sequelize(config.schema, config.user, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect
});

// Test connection.
connection.authenticate().then(() => { 
    console.log('Database connection has been established.');
}).catch(err => {
    console.error('Unable to connect to the database: ' + err)
});

// ORM
var Robots = connection.define('Robots', {
        robotId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(20),
            allowNull: false
        },
        code: {
            type: Sequelize.TEXT
        }
    }
);

var Users = connection.define('Users', {
    userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    resetPasswordToken: {
        type: Sequelize.STRING(255)
    },
    resetPasswordExpires: {
        type: Sequelize.BIGINT(20)
    }
});

var Statistics = connection.define('Statistics', {
        statisticsId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true
        },
        kills: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        deaths: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        gamesWon: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        gamesLost: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        }
    },
    { timestamps: false }
);

var Achievements = connection.define('Achievements', {
        achievementId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
    { timestamps: false }
);

Users.hasMany(Robots, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    onDelete: 'CASCADE'
});

Statistics.belongsTo(Users, {
    foreignKey: {
        name: 'userId',
        unique: true,
        allowNull: false
    },
    onDelete: 'CASCADE'
});

Users.belongsToMany(Achievements, { through: 'UsersAchievements', 
                                        foreignKey: {
                                            name: 'userId',
                                            onDelete: 'CASCADE'
                                        }
                                });

Achievements.belongsToMany(Users, { through: 'UsersAchievements', 
                                        foreignKey: {
                                            name: 'achievementId',
                                            onDelete: 'CASCADE'
                                        }   
                                });

module.exports = {
    Robots,
    Users,
    Statistics,
    Achievements,
    connection
}