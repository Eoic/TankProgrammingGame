module.exports = (sequelize, DataTypes) =>{
    const Robots = sequelize.define('Robot', {
        robotId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(15),
            allowNull: false,
            validate: {
                len: {
                    args: [3, 15],
                    msg: 'Name must be between 3 and 15 characters long.'
                }
            }
        },
        code: {
            type: DataTypes.TEXT
        },
        health: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 100,
        },
        energy: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 100,
        },
        level: {
            type: DataTypes.INTEGER(3).UNSIGNED,
            defaultValue: 1
        },
        experience: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0
        },
        attributePoints: {
            type: DataTypes.INTEGER(3).UNSIGNED,
            defaultValue: 0
        },
        kills: {
            type: DataTypes.INTEGER(5).UNSIGNED,
            defaultValue: 0
        },
        deaths: {
            type: DataTypes.INTEGER(5).UNSIGNED,
            defaultValue: 0
        }
    });

    return Robots;
};