const codeTemplate = 
`// Called once per frame.
function gameLoop(){
    obj1.x += obj1.vx;
  	obj2.x += obj2.vx;
}

// Called once bullet hits enemy robot.
function onBulletHit(bulletHitEvent){
    console.log('I hit ' + bulletHitEvent.name);
}

// Called when your robot hits another robot.
function onRobotHit(robotHitEvent){
    console.log('Collision with ' + robotHitEvent.name);
}

// For more functions see the docs.
`

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
            unique: false,
            validate: {
                len: {
                    args: [3, 15],
                    msg: 'Name must be between 3 and 15 characters long.'
                },
                isUniqueByUser: function(value, next) {
                    var self = this;
                    Robots.find({ where: {
                        userId: self.userId,
                        name: self.name
                    }}).then(function(robot){
                        if(robot)
                            return next("Robot with such name already exists.");
                        return next();
                    }).catch(function(err){
                        return next(err);
                    });
                }
            }
        },
        code: {
            type: DataTypes.TEXT,
            defaultValue: codeTemplate
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