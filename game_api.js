/*
 * Game API used to handle all player functions on the server side,
 * calculate result and send back to client.
 */

/**
 * Game API module Object.
 */
const game = {};   

/**
 * Robot movement speed.
 */
const MOVEMENT_SPEED = 2;

/**
 * Robot rotation speed.
 */
const ROTATION_SPEED = 0.1;

/**
 * Robot rotation offset in degrees.
 */
const ROTATION_OFFSET = 3;

/**
 * Cost of shooting a bullet
 * subtracted from player energy.
 */
const SHOT_EXPENSE = 10;

/**
 * Energy regeneration rate per second.
 */
const ENERGY_REGEN_RATE = 10;

/**
 * Reward value for successful kill.
 */
const KILL_EXP_REWARD = 15;

/**
 * Robot base damage.
 */
const BASE_DAMAGE = 20; 

/**
 * Initial player object.
 */
let player = {
    posX: 0,
    posY: 0,
    rotation: 0,
    health: 100,
    energy: 100,
    experience: 0,
    level: 1,
    rotating: false,
    moving: false,
    turret: {
        rotation: 0,
        rotating: false
    }
}

/**
 * Set initial data from robot object.
 * @param {Object} robotData Robot object from database.
 */
game.setPlayerData = function(robotData){
    /* TODO: Set values for player object from param. */
}

/**
 * Move robot forward for one frame.
 * @param {Float} delta Time since previous frame.
 */
game.moveForward = function(delta){
    player.posX += MOVEMENT_SPEED * Math.cos(player.rotation) * delta;
    player.posY += MOVEMENT_SPEED * Math.sin(player.rotation) * delta;
}

/**
 * Move robot backwards for one frame.
 * @param {Float} delta Time since previous frame.
 */
game.moveBack = function(delta){
    player.posX -= MOVEMENT_SPEED * Math.cos(player.rotation) * delta;
    player.posY -= MOVEMENT_SPEED * Math.sin(player.rotation) * delta;
}

/**
 * Rotate robot to specified degrees.
 * @param {Object} data Degrees to turn and delta time.
 */
game.rotate = function(data){
    if(typeof data.degrees !== 'undefined'){
        if(Math.abs(this.toDegrees(player.rotation) - data.degrees) <= ROTATION_OFFSET){
            player.rotation = this.toRadians(data.degrees);
            player.rotating = false;
        } else {
            let dir = (this.toDegrees(player.rotation) < data.degrees) ? 1 : -1;
            player.rotation += dir * ROTATION_SPEED * data.delta;
            player.rotating = true;    
        }
    }
}

/**
 * Shoot at target position.
 * @param {Object} position Target position.
 */
game.shoot = function(position){
    if(player.energy >= SHOT_EXPENSE)
        player.energy -= SHOT_EXPENSE;
    
    /* TODO: Calculate position and release bullet. */
}

/**
 * Called once player has been successfully hit
 * by enemy bullet.
 * @param {Float} damage Damage received.
 */
game.acceptDamage = function(damage){
    if(player.health >= damage)
        player.health -= damage;
    else player.health = 0;
}

/**
 * Sends notification to client side that robot has died.
 */
game.raiseDeathEvent = function(){
    // TODO: Implement death event.
}

/**
 * Sends notification to client that game has ended.
 */
game.raiseGameOverEvent = function(){
    // TODO: Imlement game over event.
}

/**
 * Sends notification to client that game has started.
 */
game.raiseGameStartEvent = function(){
    // TODO: Implement game start event.
}

/**
 * Calculates damage to enemy player.
 */
game.calculateDamage = () => Math.floor(Math.random() * (BASE_DAMAGE + 1));

/**
 * Checks if collision occoured between two objects.
 * @param {Object} firstObj 
 * @param {Object} secondObj 
 */
game.checkForCollision = function(firstObj, secondObj){
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
    hit = false;
    
    /*
    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;
  
    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;
  
    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
  
    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
  
    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
  
      //A collision might be occuring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {
  
        //There's definitely a collision happening
        hit = true;
      } else {
  
        //There's no collision on the y axis
        hit = false;
      }
    } else {
  
      //There's no collision on the x axis
      hit = false;
    }
  
    //`hit` will be either `true` or `false`
    return hit;
    */
}

/**
 * Called on successful kill.
 */
game.kill = function(){
    player.experience += KILL_EXP_REWARD;
}

/**
 * Converts given angle in radians to degrees.
 * @param {Float} radians Angle value in radians.
 */
game.toDegrees = (radians) => ((radians * 180) / Math.PI) % 360;

/**
 * Convert degrees to radians.
 * @param {Integer} degrees Angle
 */
game.toRadians = (degrees) => (degrees * Math.PI) / 180;

/**
 * Calculate degrees from current position 
 * to target Object.
 * @param {Object} t Target Object.
 */
game.degreesToTarget = (t) => Math.atan2(t.posY - player.posY, t.posX - player.posX) * 180 / Math.PI;

/**
 * Reset player Object to its initial values;
 */
game.resetPlayerData = function(){
    player = {
        posX: 0,
        posY: 0,
        rotation: 0,
        health: 100,
        energy: 100,
        rotating: false,
        moving: false,
        experience: 0,
        level: 1,
        turret: {
            rotation: 0,
            rotating: false
        }
    }
}

/**
 * Return player Object.
 */
game.getPlayer = () => player;

/**
 * Get player health.
 */
game.getHealth = () => player.health;

/**
 * Get player health.
 */
game.getEnergy = () => player.energy;

/**
 * Get player rotation in degrees.
 */
game.getRotationDegrees = () => this.toDegrees(player.rotation);

/**
 * Get player rotation in radians.
 */
game.getRotationRadians = () => player.rotation;

/**
 * Exports game API functions.
 */
module.exports = game;