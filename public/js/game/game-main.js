// Math clamp.
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

/* Info logger for game console. */
class GameLogger {

    constructor(){
        this.consoleObj = document.getElementById("console-logs");
    }

    log(message) {
        var msg = document.createElement('p');
        msg.className = "mb-0 text-light game-log";
        msg.innerText = message;
        this.consoleObj.appendChild(msg);
    }
}

const SPEED = 2;
const SCALE_MULTIPLIER = 0.95;

function hitTestRectangle(r1, r2) {

    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  
    //hit will determine whether there's a collision
    hit = false;
  
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
  };

// GAME CANVAS.
// Creating PIXI application.
let app = new PIXI.Application({
    antialias: true,
    resolution: 1
});

// PIXI app configuration.
app.renderer.backgroundColor = 0x2a2a2a;
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, document.getElementById('game-view').offsetHeight);
document.getElementById('display').appendChild(app.view);
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;

// createing PIXI objects.
var container = new PIXI.Container();
var graphics = new PIXI.Graphics();

// Creating sprites.
// -- Map
var box = PIXI.Sprite.fromImage('./img/sprites/container-obj-alt.png');

// -- Robots
var bot_base_texture = PIXI.Texture.fromImage('./img/sprites/robot_base.png');
var bot_turret_texture = PIXI.Texture.fromImage('./img/sprites/robot_turret.png');

var bot_base_1 = new PIXI.Sprite(bot_base_texture);
var bot_base_2 = new PIXI.Sprite(bot_base_texture);
var bot_turret_1 = new PIXI.Sprite(bot_turret_texture);
var bot_turret_2 = new PIXI.Sprite(bot_turret_texture);

bot_base_1.anchor.set(0.5, 0.5);
bot_turret_1.anchor.set(0.5, 0.7);
bot_turret_1.y = 0;
bot_base_2.anchor.set(0.5, 0.5);
bot_turret_2.anchor.set(0.5, 0.5);
bot_turret_2.y -= 30;

bot_turret_1.on('mouseover', function(){
    console.log("Over>>");
});


// Robot Health Bars
// Health Bar For Bot 1
var bot_healthBar_1 = new PIXI.Container();
bot_healthBar_1.position.set(-150, -300);

// Red Background
let health_innerBar_1 = new PIXI.Graphics();
health_innerBar_1.beginFill(0xFF3300);
health_innerBar_1.drawRect(0, 0, box.width / 3, 50);
health_innerBar_1.endFill();
bot_healthBar_1.addChild(health_innerBar_1);

// Green ForeGround
let health_outerBar_1 = new PIXI.Graphics();
health_outerBar_1.beginFill(0x00FF00);
health_outerBar_1.drawRect(0, 0, box.width / 3, 50);
health_outerBar_1.endFill();
bot_healthBar_1.addChild(health_outerBar_1);

// Health Bar For Bot 2
var bot_healthBar_2 = new PIXI.Container();
bot_healthBar_2.position.set(-150, -300);

// Red Background
let health_innerBar_2 = new PIXI.Graphics();
health_innerBar_2.beginFill(0xFF3300);
health_innerBar_2.drawRect(0, 0, box.width / 3, 50);
health_innerBar_2.endFill();
bot_healthBar_2.addChild(health_innerBar_2);

// Green ForeGround
let health_outerBar_2 = new PIXI.Graphics();
health_outerBar_2.beginFill(0x00FF00);
health_outerBar_2.drawRect(0, 0, box.width / 3, 50);
health_outerBar_2.endFill();
bot_healthBar_2.addChild(health_outerBar_2);


var obj1 = new PIXI.Container();
obj1.addChild(bot_base_1);
obj1.addChild(bot_turret_1);
obj1.addChild(bot_healthBar_1);
obj1.healthBar = health_outerBar_1;

var obj2 = new PIXI.Container();
obj2.addChild(bot_base_2);
obj2.addChild(bot_turret_2);
obj2.addChild(bot_healthBar_2);
obj2.healthBar = health_outerBar_2; // so you dont need to write obj2.bot-healthBar_2.outerHealthbar..

obj1.scale.set(0.25, 0.25);
obj2.scale.set(0.25, 0.25);

/*
obj1.hitArea = new PIXI.Rectangle(0, 0, 300, 300);
obj1.on('mouseover', function(e){
    console.log("Mouse is over me");
});
*/
// -- UI Elements.
var zoomInButton = createButton('./img/gameui/zoom-in.png');
var zoomOutButton = createButton('./img/gameui/zoom-out.png');

// Adding content(sprites) to scene.
app.stage.addChild(container);

// Creating object container.
container.addChild(box);

box.addChild(obj1);
box.addChild(obj2);

container.interactive = true;
container.on('pointerdown', onDragStart)
         .on('pointerup', onDragEnd)
         .on('pointerupoutside', onDragEnd)
         .on('pointermove', onDragMove);

// User input events on PIXI objects.
function onDragStart(event){
    this.data = event.data;
    this.dragging = true;
    this.clickOffset = this.data.getLocalPosition(this);
}

function onDragMove(){
    if(this.dragging){
        var newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x - (this.clickOffset.x * container.scale.x);
        this.y = newPosition.y - (this.clickOffset.y * container.scale.y);
    }
}

function onDragEnd(){
    this.dragging = false;
    this.data = null;
    saveMapState();
}

// # Resize game canvas to available size.
function resizeSceneToFit(){
    app.renderer.resize(window.innerWidth, document.getElementById('game-view').offsetHeight);
}

// Centering container to screen.
function centerContainer(){

    var mapOffset = 0;
    const sidebarState = this.localStorage.getItem('robotListSidebar');

    if(sidebarState && sidebarState === "open")
        mapOffset = 250;

    container.x = ((app.screen.width - mapOffset) - container.width) / 2;
    container.y = (app.screen.height - container.height) / 2;
    saveMapState();
}

// Global user input events.
// Set game map to last position and size.
window.onload = function(){
    var mapState = JSON.parse(this.localStorage.getItem('map-state'));

    if(mapState){
        container.scale.x = mapState.scaleX;
        container.scale.y = mapState.scaleY;
        container.x = mapState.posX;
        container.y = mapState.poxY;
    }

    app.render(container);
}

// Stretch game scene to full width.
window.onresize = resizeSceneToFit;

// Mouse scroll wheel zooming.
function zoomOnWheel(event){
    if(event.deltaY < 0)
        mapZoomIn();

    if(event.deltaY > 0)
        mapZoomOut();
}

// Map zooming in/out.
function mapZoomIn(){
    container.scale.x = (container.scale.x / SCALE_MULTIPLIER).clamp(0.25, 5);
    container.scale.y = (container.scale.y / SCALE_MULTIPLIER).clamp(0.25, 5);
    saveMapState();
}

function mapZoomOut(){
    container.scale.x = (container.scale.x * SCALE_MULTIPLIER).clamp(0.25, 5);
    container.scale.y = (container.scale.y * SCALE_MULTIPLIER).clamp(0.25, 5);
    saveMapState();
}

function saveMapState(){
    var mapState = {
        'scaleX': container.scale.x,
        'scaleY': container.scale.y,
        'posX': container.x,
        'poxY': container.y
    };

    localStorage.setItem('map-state', JSON.stringify(mapState));
}

//game variables////////////////////
obj1.position.x = 100;
obj1.position.y = box.height / 2;
obj2.position.set(box.width - obj2.width - 100, box.height / 2);

// health of the objects
obj1.health = 100;
obj2.health = 100;

// attack value of the objects
obj1.attack = 100;
obj2.attack = 100;

// defence value of the objects
obj1.defence = 100;
obj2.defence = 100;

var frameCounter = 0;
//vx, vy = velocity
var bullets = {};
var bulletCount = 0;


obj1.vy, obj2.vy = 0;
obj1.vx = 1;
obj2.vx = -1;

////////////////////////////////////

//all game logic goes here//////////////////////////////////
//this function is called every fps
function gameLogic(){
    frameCounter++;
    // if(collision(obj1,obj2)){
    //     obj1.visible = false;
    //     obj2.visible = false;
    // }
    for ( var j = 0; j < bulletCount; j++ ){
        if (collision(obj2, bullets[j]) && obj2.visible && bullets[j].visible){
            bullets[j].visible = false;
            
            calculateDamage(obj1, obj2);

            if (obj2.health <= 0){
                obj2.visible = false;
            }
        }
        moveSprite(bullets[j], bullets[j].vx, bullets[j].vy);
    }

  //  moveSprite(obj2, (Math.random().toPrecision(2) - Math.random().toPrecision(2))*8 ,(Math.random().toPrecision(2) -  Math.random().toPrecision(2))*8);
    //every 2 seconds change bullet direction
    if(frameCounter == 120){
        if (obj2.visible){
            fireBullet(obj1, obj2, 10);
        }

        frameCounter = 0;
    }

    //if object hits a wall, change its direction to opposite
    changeDirectionToOpposite(obj1, contain(obj1,box));
    changeDirectionToOpposite(obj2, contain(obj2,box));
}
///////////////////////////////////////////////////////////////



//////////////////////////Game functions/////////////////////////////////////
/**
 * Moves sprite 
 * @param {*} sprite 
 * @param {*} vx 
 * @param {*} vy 
 */


 /*
  * fireFrom - the object the bullet will be fired from.
  * fireAt - the object the bullet will be fired at.
  * speed - the speed of the bullet;
  */
function fireBullet(fireFrom, fireAt, speed){
    bullets[bulletCount] = PIXI.Sprite.fromImage('./img/sprites/bullet.png');
    box.addChild(bullets[bulletCount]);

    bullets[bulletCount].position.set(fireFrom.position.x, fireFrom.position.y );

    // finding the direction the bullet will be fired at.
    var tx = fireAt.position.x - bullets[bulletCount].position.x;
    var ty = fireAt.position.y - bullets[bulletCount].position.y;
    var length = Math.sqrt(( tx * tx ) +  ( ty * ty ));
    bullets[bulletCount].vx = speed * tx / length;
    bullets[bulletCount].vy = speed * ty / length;

    bulletCount++;
}


function moveSprite(sprite, vx, vy){
    sprite.position.x += vx;
    sprite.position.y += vy;
}


/**
 * Doesn't let the sprite get out of container
 * @param {*} sprite 
 * @param {*} container 
 */
function contain(sprite, container) {

    let collision = undefined;
  
    //Left
    if (sprite.x < container.x) {
      sprite.x = container.x;
      collision = "left";
    }
  
    //Top
    if (sprite.y < container.y) {
      sprite.y = container.y;
      collision = "top";
    }
  
    //Right
    if (sprite.x + sprite.width > container.width) {
      sprite.x = container.width - sprite.width;
      collision = "right";
    }
  
    //Bottom
    if (sprite.y + sprite.height > container.height) {
      sprite.y = container.height - sprite.height;
      collision = "bottom";
    }
  
    //Return the `collision` value
    return collision;
  }


/**
 * Changes sprite direction to opposite
 * @param {*} sprite 
 * @param {"left"|"right"|"top"|"bottom"} currentDirection 
 */
function changeDirectionToOpposite(sprite, currentDirection){
    switch (currentDirection) {
        case "left":
            sprite.vx = Math.abs(sprite.vx);
            break;

        case "top":
            sprite.vy = Math.abs(sprite.vy);
            break;

        case "right":
            sprite.vx = sprite.vx - sprite.vx - sprite.vx;
            break;

        case "bottom":
            sprite.vy = sprite.vy - sprite.vy - sprite.vy;
            break;

        default:
            break;
    }
}

//Checks if two object are collided
function collision(r1, r2) {

    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  
    //hit will determine whether there's a collision
    hit = false;
  
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
  };


  function calculateDamage(attacker, defender){
      var attackerRoll = Math.floor(Math.random() * ( attacker.attack + 1 ));
      var defenderRoll = Math.floor(Math.random() * (defender.defence + 1 ));

      if ( attackerRoll > defenderRoll ){
         var damageRoll = Math.floor(Math.random() * ( attacker.attack / 2 + 1 ));
         alert("Damage roll: " + damageRoll);
         dealDamage(defender, damageRoll);
        }   
    else{
        alert("NO damage dealt, Attackers roll:" + attackerRoll + ", Defenders Roll:" + defenderRoll);
    }
  }

  function dealDamage(object, damage){
    object.health -= damage;
    if ( object.health < 0 ) 
        object.health = 0;

    object.healthBar.width = ( box.width / 3) / ( 100 / obj2.health );
  }
/////////////////////////////////////////////////////////////////////////////////////



// Creating UI elements.
// Should be moved to separate function.
zoomInButton.scale.x = 0.5;
zoomInButton.scale.y = 0.5;

zoomOutButton.scale.x = 0.5;
zoomOutButton.scale.y = 0.5

zoomInButton.y = 50;
zoomInButton.x = 20;
zoomOutButton.y = 120;
zoomOutButton.x = 20;

zoomInButton.on('pointerdown', mapZoomIn);
zoomOutButton.on('pointerdown', mapZoomOut);

app.stage.addChild(zoomInButton);
app.stage.addChild(zoomOutButton);

function createButton(path){
    var button = PIXI.Sprite.fromImage(path);
    button.interactive = true;
    button.buttonMode = true;
    return button;
}
