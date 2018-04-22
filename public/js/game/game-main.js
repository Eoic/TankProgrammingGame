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

// Creating sprites.
// -- Map
var box = PIXI.Sprite.fromImage('./img/sprites/container-obj.png');
var obj = PIXI.Sprite.fromImage('./img/sprites/obj.png');

obj.position.x = 100;

// -- UI Elements.
var zoomInButton = createButton('./img/gameui/zoom-in.png');
var zoomOutButton = createButton('./img/gameui/zoom-out.png');

// Adding content(sprites) to scene.
app.stage.addChild(container);

// Creating object container.
container.addChild(box);
container.addChild(obj);
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
    container.scale.x = 0.5;
    container.scale.y = 0.5;
    container.x = (app.screen.width - container.width) / 2;
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
