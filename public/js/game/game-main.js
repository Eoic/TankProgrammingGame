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
var obj = PIXI.Sprite.fromImage('./img/sprites/obj.png');

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
}

// Container centering.
centerContainer();

// # Resize game canvas to available size.
function resizeSceneToFit(){
    app.renderer.resize(window.innerWidth, document.getElementById('game-view').offsetHeight);
    centerContainer();
}

// Centering container to screen.
function centerContainer(){
    //container.x = (app.screen.width - container.width) / 2;
    container.y = (app.screen.height - container.height) / 2;
}

// Global user input events.
window.onresize = resizeSceneToFit;
window.onwheel =  function(event){
    if(event.deltaY < 0){
        mapZoomIn();
    }

    if(event.deltaY > 0){
        mapZoomOut();
    }
}

// Map zooming in/out.
function mapZoomIn(){
    container.scale.x /= 0.95;
    container.scale.y /= 0.95;
}

function mapZoomOut(){
    container.scale.x *= 0.95;
    container.scale.y *= 0.95;
}

// Creating UI elements.
zoomOutButton.y = 100;

zoomInButton.on('pointerdown', function(){
    mapZoomIn();
});

zoomOutButton.on('pointerdown', function(){
    mapZoomOut();
});

app.stage.addChild(zoomInButton);
app.stage.addChild(zoomOutButton);

function createButton(path){
    var button = PIXI.Sprite.fromImage(path);
    button.interactive = true;
    button.buttonMode = true;
    return button;
}