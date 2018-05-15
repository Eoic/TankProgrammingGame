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
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

// createing PIXI objects.
var container = new PIXI.Container();
var graphics = new PIXI.Graphics();

// Creating sprites.
// -- Map
var box = PIXI.Sprite.fromImage('./img/sprites/container-obj.png');
var obj1 = PIXI.Sprite.fromImage('./img/sprites/obj.png');
var obj2 = PIXI.Sprite.fromImage('./img/sprites/obj.png');
var bullet1 = PIXI.Sprite.fromImage('./img/sprites/bullet.png');
var bullet2 = PIXI.Sprite.fromImage('./img/sprites/bullet.png');


// -- UI Elements.
var zoomInButton = createButton('./img/gameui/zoom-in.png');
var zoomOutButton = createButton('./img/gameui/zoom-out.png');

// Adding content(sprites) to scene.
app.stage.addChild(container);

// Creating object container.
container.addChild(box);
box.addChild(obj1);
box.addChild(obj2);
box.addChild(bullet1);
box.addChild(bullet2);
// bullet1.visible = false;
// bullet2.visible = false;
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
    //centerContainer();
}

// Centering container to screen.
function centerContainer(){
    container.x = (app.screen.width - container.width) / 2;
    container.y = (app.screen.height - container.height) / 2;
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
    container.scale.x /= 0.95;
    container.scale.y /= 0.95;
    saveMapState();
}

function mapZoomOut(){
    container.scale.x *= 0.95;
    container.scale.y *= 0.95;
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

//game variables
obj1.position.x = 100;
obj1.position.y = box.height / 2;
obj2.position.set(box.width - obj2.width - 100, box.height / 2);
var frameCounter = 0; 
var x1 = Math.random().toPrecision(2)-0.5;
var y1 = Math.random().toPrecision(2)-0.5;
var x2 = Math.random().toPrecision(2)-0.5;
var y2 = Math.random().toPrecision(2)-0.5;
bullet1.position.set(box.width / 2, box.height / 2 );
bullet2.position.set(box.width / 2, box.height / 2 );

//all game logic goes here
function gameLogic(){
    frameCounter++;
    // if(collision(obj1,obj2)){
    //     obj1.visible = false;
    //     obj2.visible = false;
    // }
    if(collision(obj1,bullet2)){
        obj1.visible = false;
    }
    if(collision(obj2,bullet1)){
        obj2.visible = false;
    }
    if(collision(obj1,bullet1)){
        obj1.visible = false;
    }
    if(collision(obj2,bullet2)){
        obj2.visible = false;
    }
    shootBullet(bullet1,x1,y1);
    shootBullet(bullet2,x2,y2);
    //every 2 seconds change bullet direction
    if(frameCounter == 120){
        x1 = Math.random().toPrecision(2)-0.5;
        y1 = Math.random().toPrecision(2)-0.5;
        x2 = Math.random().toPrecision(2)-0.5;
        y2 = Math.random().toPrecision(2)-0.5;
        frameCounter = 0;
    }
}

function shootBullet(bullet, x, y){
    bullet.position.x += x;
    bullet.position.y += y;
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
