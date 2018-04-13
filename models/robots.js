module.exports = (sequelize, DataTypes) =>{
    const Robots = sequelize.define('Robots', {
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
        }
    });

    return Robots;
};