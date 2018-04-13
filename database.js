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

database.User = require('./models/users.js')(sequelize, Sequelize);
database.Achievements = require('./models/achievements.js')(sequelize, Sequelize);
database.Robots = require('./models/robots.js')(sequelize, Sequelize);
database.Statistic = require('./models/statistics.js')(sequelize, Sequelize);

database.User.hasMany(database.Robots, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    onDelete: 'CASCADE'
});

database.User.hasOne(database.Statistic, {
    foreignKey: {
        name: 'userId',
        unique: true,
        allowNull: true,
    },
    onDelete: 'CASCADE'
});

database.User.belongsToMany(database.Achievements, { through: 'UsersAchievements', 
                                        foreignKey: {
                                            name: 'userId',
                                            onDelete: 'CASCADE'
                                        }
                                });

database.Achievements.belongsToMany(database.User, { through: 'UsersAchievements', 
                                        foreignKey: {
                                            name: 'achievementId',
                                            onDelete: 'CASCADE'
                                        }   
                                });

module.exports = database;