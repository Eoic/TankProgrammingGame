const config = require('./config').dev.database;
const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.schema, config.user, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect
});

const database = {};

database.Sequelize = Sequelize;
database.sequelize = sequelize;

database.Users = require('./models/users.js')(sequelize, Sequelize);
database.Achievements = require('./models/achievements.js')(sequelize, Sequelize);
database.Robots = require('./models/robots.js')(sequelize, Sequelize);
database.Statistics = require('./models/statistics.js')(sequelize, Sequelize);

database.Users.hasMany(database.Robots, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    onDelete: 'CASCADE'
});

database.Statistics.belongsTo(database.Users, {
    foreignKey: {
        name: 'userId',
        unique: true,
        allowNull: false
    },
    onDelete: 'CASCADE'
});

database.Users.belongsToMany(database.Achievements, { through: 'UsersAchievements', 
                                        foreignKey: {
                                            name: 'userId',
                                            onDelete: 'CASCADE'
                                        }
                                });

database.Achievements.belongsToMany(database.Users, { through: 'UsersAchievements', 
                                        foreignKey: {
                                            name: 'achievementId',
                                            onDelete: 'CASCADE'
                                        }   
                                });

module.exports = database;