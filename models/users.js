var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
        var Users = sequelize.define('User', {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: DataTypes.STRING(15),
                allowNull: false,
                unique: true,
                validate: {
                    len: {
                        args: [5, 15],
                        msg: 'Username must be between 5 and 15 characters long.'
                    },
                    isUnique: function(value, next) {
                        Users.find({
                        where: { username: value },
                        attributes: ['userId']
                        }).done((user) => {
                        if (user)
                            return next('Username is already taken.');
                        next();
                        });
                    }
                }
            },
            email: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: {
                        msg: 'Entered email is invalid.'
                    },
                    isUnique: function(value, next) {
                        Users.find({
                        where: { email: value },
                        attributes: ['userId']
                        }).done((user) => {
                        if (user)
                            return next('Email is already taken.');
                        next();
                        });
                    }
                }
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    len: {
                        args: [6, 255],
                        msg: 'Password is too short'
                    }
                }
            },
            resetPasswordToken: {
                type: DataTypes.STRING(255)
            },
            resetPasswordExpires: {
                type: DataTypes.BIGINT(20)
            }
        }, 
        {
            hooks: {
                afterValidate: function(user){ 
                    user.password = bcrypt.hashSync(user.password, 5);
                }
            }
        }
    );

    return Users;
};