module.exports = (sequelize, DataTypes) =>{
    const Statistics = sequelize.define('Statistic', {
            statisticsId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                unique: true
            },
            kills: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            deaths: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            gamesWon: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            gamesLost: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            }
        },
        {   
            timestamps: false 
        }
    );

    return Statistics;
};