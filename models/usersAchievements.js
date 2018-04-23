module.exports = (sequelize, DataTypes) =>{
    const UsersAchievements = sequelize.define('UserAchievement', {
            achievementId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            updatedAt:{
                type: DataTypes.DATE,
                allowNull: false
            },
            createdAt:{
                type: DataTypes.DATE,
                allowNull: false
            }
            
        },
        { timestamps: false }
    );

    return UsersAchievements;
};