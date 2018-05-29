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
const HP_BAR_HEIGHT = 25;

/**
 * Sprite mouse over tint;
 */
const MOUSE_OVER_TINT = 0x5E85C4;

/**
 * Default scale of robot container.
 */
const ROBOT_SCALE = 0.25;

/**
 * Clamps and returns value between two numbers.
 * @param {Float} min Min value.
 * @param {Float} max Max value.
 */
Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

/* Creating PIXI application. */
let app = new PIXI.Application({
    antialias: true,
    resolution: 1
});

/* PIXI application config. */
app.renderer.backgroundColor = 0x2a2a2a;
app.renderer.autoResize = true;
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
    sprites.robotBasePlayer = new PIXI.Sprite(resources.robot_base.texture);        /* Player tank base.    */
    sprites.robotBaseEnemy = new PIXI.Sprite(resources.robot_base.texture);         /* Enemy tank base.     */
    sprites.robotTurretPlayer = new PIXI.Sprite(resources.robot_turret.texture);    /* Player turret.       */
    sprites.robotTurretEnemy = new PIXI.Sprite(resources.robot_turret.texture);     /* Enemy turret.        */
    sprites.zoomInButton = new PIXI.Sprite(resources.zoomInButton.texture);         /* Zoom in button.      */
    sprites.zoomOutButton = new PIXI.Sprite(resources.zoomOutButton.texture);       /* Zoom out button.     */
});

loader.onProgress.add((loader, resource) => {
    console.log('Loading');
    updateLoadingScreen(loader.progress);
});

/* On load completion. */
loader.onComplete.add(() => {

    /* Robots containers. */
    var playerRobot = new PIXI.Container();
    var enemyRobot = new PIXI.Container();

    /* Adding graphics. */
    playerRobot.addChild(sprites.robotBasePlayer);
    playerRobot.addChild(sprites.robotTurretPlayer);
    enemyRobot.addChild(sprites.robotBaseEnemy);
    enemyRobot.addChild(sprites.robotTurretEnemy);

    /* Setting anchor points. */
    sprites.robotBasePlayer.anchor.set(0.5, 0.5);
    sprites.robotBaseEnemy.anchor.set(0.5, 0.5);
    sprites.robotTurretPlayer.anchor.set(0.5, 0.7);
    sprites.robotTurretEnemy.anchor.set(0.5, 0.7);

    addHealthBar(playerRobot);
    addHealthBar(enemyRobot);

    setInitialPosition(playerRobot, 50, 50);
    setInitialPosition(enemyRobot, MAP_WIDTH - 50, MAP_HEIGHT - 50);

    gameObjects.playerRobot = playerRobot;
    gameObjects.enemyRobot = enemyRobot;

    setupZoomButtons();         /* Setting zoom buttons */
    bindPointerEvents();        /* Pointer events binding */

    /* Adding sprites to scene. */
    container.addChild(sprites.map);
    container.addChild(gameObjects.playerRobot);
    container.addChild(gameObjects.enemyRobot);
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
 * Adds health bar to robot game object.
 * @param {Robot game object.} robotContainer 
 */
function addHealthBar(robotContainer){
    var healthBar = createHealthBar();
    robotContainer.addChild(healthBar);                  
    robotContainer.healthBar = healthBar.getChildAt(1);  
    robotContainer.scale.set(ROBOT_SCALE, ROBOT_SCALE);
}

/**
 * Creates health bar for playerRobot.
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
 * Sets initial position for robot game object.
 * @param {Object} robotContainer 
 */
function setInitialPosition(robotContainer, x, y){
    if(x === null || y === null || x < 0 || y < 0 || x > MAP_WIDTH || y > MAP_HEIGHT){
        return;
    }

    robotContainer.position.set(x, y);
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
    if(document.getElementById('gameProgressBar') !== null)
        document.getElementById('gameProgressBar').style ='width: ' + value + '%';
}

/**
 * Hides progres bar once resources loaded.
 */
function hideLoadingScreen(){
    if(document.getElementById('loadingScreenWindow') !== null)
        document.getElementById('loadingScreenWindow').className = 'no-display';
}

/**
 * Creates PixjJS game scene.
 */
function createGameScene(){
    app.renderer.resize(window.innerWidth, document.getElementById('game-view').offsetHeight);
    document.getElementById('display').appendChild(app.view);
}