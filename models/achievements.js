module.exports = (sequelize, DataTypes) =>{
    const Achievements = sequelize.define('Achievement', {
            achievementId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            description: {
                type: DataTypes.STRING(125),
                allowNull: false
            }
        },
        { timestamps: false }
    );

    return Achievements;
};