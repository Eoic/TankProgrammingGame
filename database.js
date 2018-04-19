const config = require('./config').dev.database;
const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.schema, config.user, config.password, {
    logging: config.logging,
    host: config.host,
    port: config.port,
    dialect: config.dialect
});

sequelize.authenticate()
.then('Connection has been established.')
.catch(err => { 
    console.log(err)
});

const database = {};

database.Sequelize = Sequelize;
database.sequelize = sequelize;

database.User = require('./models/users.js')(sequelize, Sequelize);
database.Achievement = require('./models/achievements.js')(sequelize, Sequelize);
database.Robot = require('./models/robots.js')(sequelize, Sequelize);
database.Statistic = require('./models/statistics.js')(sequelize, Sequelize);

database.User.hasMany(database.Robot, {
    foreignKey: {
        name: 'userId',
        //allowNull: false
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

database.User.belongsToMany(database.Achievement, { through: 'UsersAchievements', 
                                        foreignKey: {
                                            name: 'userId',
                                            onDelete: 'CASCADE'
                                        }
                                });

database.Achievement.belongsToMany(database.User, { through: 'UsersAchievements', 
                                        foreignKey: {
                                            name: 'achievementId',
                                            onDelete: 'CASCADE'
                                        }   
                                });

module.exports = database;