/**
 * Map scale zoom on single zoom button click.
 */
const SCALE_MULTIPLIER = 0.95;

/**
 * Minumum map size.
 */
const MAP_ZOOM_MIN = 0.25;

/**
 * Maximum map size.
 */
const MAP_ZOOM_MAX = 5;

/**
 * Game map width.
 */
const MAP_WIDTH = 886;

/**
 * Game map height.
 */
const MAP_HEIGHT = 482;

/**
 * Health bar width.
 */
const HP_BAR_WIDTH = 300;

 /**
  * Health bar height.
  */
const HP_BAR_HEIGHT = 50;

/**
 * Sprite mouse over tint;
 */
const MOUSE_OVER_TINT = 0x5E85C4;

/**
 * Clamps and returns value between two numbers.
 * @param {Float} min Min value.
 * @param {Float} max Max value.
 */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

/**
 * Log levels enum
 */
const LOG_LEVEL = {
    INFO: 'text-light',
    WARN: 'text-warning',
    DANGER: 'text-danger'
}

/**
 * Info logger for game console.
 */
class GameLogger {

    constructor(){
        this.consoleObj = document.getElementById("console-logs");
        this.logColor = LOG_LEVEL.INFO;
    }

    setLevel(state){
        if(Object.values(LOG_LEVEL).includes(state))
            this.logColor = state;
    }

    log(message) {
        var msg = document.createElement('p');
        msg.className = 'mb-0 game-log ' + this.logColor;
        msg.innerText = message;
        this.consoleObj.appendChild(msg);
    }
}

/* Creating PIXI application. */
let app = new PIXI.Application({
    antialias: true,
    resolution: 1
});

/* PIXI application config. */
app.renderer.backgroundColor = 0x2a2a2a;
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, document.getElementById('game-view').offsetHeight);
document.getElementById('display').appendChild(app.view);
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;

var container = new PIXI.Container();   /* Map container.   */
const loader = new PIXI.Loader();       /* Rosources loader.*/
const sprites = {};                     /* Loaded sprites.  */
const gameObjects = {};                 /* Game objects     */

/* Add resources for loading. */
loader.add('map', './img/sprites/container-obj-alt.png')
      .add('robot_base', './img/sprites/robot_base.png')
      .add('robot_turret', './img/sprites/robot_turret.png')
      .add('zoomInButton', './img/gameui/zoom-in.png')
      .add('zoomOutButton', './img/gameui/zoom-out.png');

/* Load resources. */
loader.load((loader, resources) => {
    sprites.map = new PIXI.Sprite(resources.map.texture);
    sprites.robotBase = new PIXI.Sprite(resources.robot_base.texture);
    sprites.robotTurret = new PIXI.Sprite(resources.robot_turret.texture);
    sprites.zoomInButton = new PIXI.Sprite(resources.zoomInButton.texture);
    sprites.zoomOutButton = new PIXI.Sprite(resources.zoomOutButton.texture);
});

loader.onProgress.add((loader, resource) => {
    console.log('Loading');
    updateLoadingScreen(loader.progress);
});

/* On load completion. */
loader.onComplete.add(() => {

    /* Robot container. */
    var robot = new PIXI.Container();

    /* Setting robot position. */
    sprites.robotBase.anchor.set(0.5, 0.5);
    sprites.robotTurret.anchor.set(0.5, 0.7);
    //sprites.robotTurret.t = 0;

    robot.addChild(sprites.robotBase);
    robot.addChild(sprites.robotTurret);

    var healthBar = createHealthBar();          /* Creates new health bar.                                  */
    robot.addChild(healthBar);                  /* Adds health bar to robot container.                      */
    robot.healthBar = healthBar.getChildAt(1);  /* Adds outer healthBar to container healthBar prototype.   */
    robot.scale.set(0.25, 0.25);
    gameObjects.robot = robot;

    setupZoomButtons();         /* Setting zoom buttons */
    bindPointerEvents();        /* Pointer events binding */

    /* Adding sprites to scene. */
    container.addChild(sprites.map);
    container.addChild(robot);
    app.stage.addChild(container);
    app.stage.addChild(sprites.zoomInButton);
    app.stage.addChild(sprites.zoomOutButton);

    /* Hides progress bar. */
    setTimeout(hideLoadingScreen, 1000);
});

/**
 * Binds pointer events to objects
 * which interacts with mouse cursor.
 */
function bindPointerEvents(){
    sprites.zoomInButton.on('pointerdown',  mapZoomIn);
    sprites.zoomOutButton.on('pointerdown', mapZoomOut);
    sprites.zoomInButton.on('pointerover',  () => { sprites.zoomInButton.tint = MOUSE_OVER_TINT });
    sprites.zoomOutButton.on('pointerover', () => { sprites.zoomOutButton.tint = MOUSE_OVER_TINT });
    sprites.zoomInButton.on('pointerout',   () => { sprites.zoomInButton.tint = 0xFFFFFF });
    sprites.zoomOutButton.on('pointerout',  () => { sprites.zoomOutButton.tint = 0xFFFFFF });
}

/**
 * Sets scale and positions of map zoom buttons.
 */
function setupZoomButtons(){
    sprites.zoomInButton.scale.set(0.5, 0.5);
    sprites.zoomOutButton.scale.set(0.5, 0.5);
    sprites.zoomInButton.position.set(20, 50);
    sprites.zoomOutButton.position.set(20, 120);
    sprites.zoomInButton.interactive = true;
    sprites.zoomInButton.buttonMode = true;
    sprites.zoomOutButton.interactive = true;
    sprites.zoomOutButton.buttonMode = true;
}

/**
 * Creates health bar for robot.
 */
function createHealthBar(){
    var healthBar = new PIXI.Container();
    healthBar.position.set(-150, -300); // ?

    /* Background */
    var healthBarInner = new PIXI.Graphics();
    healthBarInner.beginFill(0xF44336);
    healthBarInner.drawRect(0, 0, HP_BAR_WIDTH, HP_BAR_HEIGHT);
    healthBarInner.endFill();
    healthBar.addChild(healthBarInner);

    /* Foreground */
    var healthBarOuter = new PIXI.Graphics();
    healthBarOuter.beginFill(0x43A047);
    healthBarOuter.drawRect(0, 0, HP_BAR_WIDTH, HP_BAR_HEIGHT);
    healthBarOuter.endFill();   
    healthBar.addChild(healthBarOuter);
    
    return healthBar;
}

/**
 * Updates health bar by subtracting received damage value.
 * @param {Float} damage Damage received.
 */
function updateHealthBar(damage, robotObject){
    var hpBarWidth = robotObject.healthBar.width;
    console.log(hpBarWidth);

    if(hpBarWidth >= damage)
        robotObject.healthBar.width -= (HP_BAR_WIDTH / 100) * damage;
    else robotObject.healthBar.width = 0;
}

/**
 * Resets health bar to full health.
 * @param {Object} robotObject 
 */
function resetHealthBar(robotObject){
    robotObject.healthBar.width = HP_BAR_WIDTH;
}

/**
 * Game scene events.
 */
container.interactive = true;
container.on('pointerdown', onDragStart)
         .on('pointerup', onDragEnd)
         .on('pointerupoutside', onDragEnd)
         .on('pointermove', onDragMove);

/**
 * Callsed once when map is moved with mouse.
 * @param {Object} event 
 */
function onDragStart(event){
    this.data = event.data;
    this.dragging = true;
    this.clickOffset = this.data.getLocalPosition(this);
}

/**
 * Called while map is being draged.
 */
function onDragMove(){
    if(this.dragging){
        var newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x - (this.clickOffset.x * container.scale.x);
        this.y = newPosition.y - (this.clickOffset.y * container.scale.y);
    }
}

/**
 * Calld once when map dragging has ended.
 */
function onDragEnd(){
    this.dragging = false;
    this.data = null;
    saveMapState();
}

/**
 * Resizes game canvas to available size.
 */
function resizeSceneToFit(){
    app.renderer.resize(window.innerWidth, document.getElementById('game-view').offsetHeight);
}

/**
 * Centers game map.
 */
function centerContainer(){

    var mapOffset = 0;
    const sidebarState = this.localStorage.getItem('robotListSidebar');

    if(sidebarState && sidebarState === "open")
        mapOffset = 250;

    container.x = ((app.screen.width - mapOffset) - container.width) / 2;
    container.y = (app.screen.height - container.height) / 2;
    saveMapState();
}

/**
 * Set game map to last position and size
 * if map coordinates is available in local storage.
 */
window.onload = function(){
    var mapState = JSON.parse(this.localStorage.getItem('map-state'));

    if(mapState){
        container.scale.x = mapState.scaleX;
        container.scale.y = mapState.scaleY;
        container.x = mapState.posX;
        container.y = mapState.poxY;
    }
}

/**
 * Stretches outer game scene to full width.
 */
window.onresize = resizeSceneToFit;

/**
 * Resizes game map on mouse wheel scroll.
 * @param {Object} event 
 */
function zoomOnWheel(event){
    if(event.deltaY < 0)
        mapZoomIn();

    if(event.deltaY > 0)
        mapZoomOut();
}

/**
 * Zooms map in.
 */
function mapZoomIn(){
    container.scale.x = (container.scale.x / SCALE_MULTIPLIER).clamp(MAP_ZOOM_MIN, MAP_ZOOM_MAX);
    container.scale.y = (container.scale.y / SCALE_MULTIPLIER).clamp(MAP_ZOOM_MIN, MAP_ZOOM_MAX);
    saveMapState();
}

/**
 * Zooms map out.
 */
function mapZoomOut(){
    container.scale.x = (container.scale.x * SCALE_MULTIPLIER).clamp(MAP_ZOOM_MIN, MAP_ZOOM_MAX);
    container.scale.y = (container.scale.y * SCALE_MULTIPLIER).clamp(MAP_ZOOM_MIN, MAP_ZOOM_MAX);
    saveMapState();
}

/**
 * Saves map coordinates and scale in local storage.
 */
function saveMapState(){
    var mapState = {
        'scaleX': container.scale.x,
        'scaleY': container.scale.y,
        'posX': container.x,
        'poxY': container.y
    };

    localStorage.setItem('map-state', JSON.stringify(mapState));
}

/**
 * Updates progress bar while resources are being loaded.
 * @param {Float} value 
 */
function updateLoadingScreen(value){
    document.getElementById('gameProgressBar').style ='width: ' + value + '%';
}

/**
 * Hides progres bar once resources loaded.
 */
function hideLoadingScreen(){
    document.getElementById('loadingScreenWindow').className = 'no-display';
}

/* --------------------------------------------------------------------------------------------------------------- */
/*
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

*/

/*
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
*/

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
 /*
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
*/

/**
 * Doesn't let the sprite get out of container
 * @param {*} sprite 
 * @param {*} container 
 */
/*
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
*/