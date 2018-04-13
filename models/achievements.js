module.exports = (sequelize, DataTypes) =>{
    const Achievements = sequelize.define('Achievements', {
            achievementId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        { timestamps: false }
    );

    return Achievements;
};