// Creating PIXI application.
// # Setup.
let app = new PIXI.Application({
    antialias: true,
    resolution: 1
});

app.renderer.backgroundColor = 0x061639;
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, document.getElementById('game-view').offsetHeight);
document.getElementById('display').appendChild(app.view);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

var container = new PIXI.Container();
var graphics = new PIXI.Graphics();

// Drawing rectangle.
var box = PIXI.Sprite.fromImage('./img/sprites/container-obj.png');

// Adding content to scene.
app.stage.addChild(container);
container.addChild(box);

// Container centering.
centerContainer();

// # Resize game canvas to available size.
function resizeSceneToFit(){
    app.renderer.resize(window.innerWidth, document.getElementById('game-view').offsetHeight);
    centerContainer();
}

// Centering container to screen.
function centerContainer(){
    container.x = (app.screen.width - container.width) / 2;
    container.y = (app.screen.height - container.height) / 2;
}

// Resize game canvas on window resize.
window.onresize = resizeSceneToFit();

// ----- UI ELEMENTS ------
var zoomInButton = createButton('./img/gameui/zoom-in.png');
var zoomOutButton = createButton('./img/gameui/zoom-out.png');

zoomOutButton.y = 100;

zoomInButton.on('pointerdown', function(){
    box.scale.x /= 0.75;
    box.scale.y /= 0.75;
    centerContainer();
});

zoomOutButton.on('pointerdown', function(){
    box.scale.x *= 0.75;
    box.scale.y *= 0.75;
    centerContainer();
});

app.stage.addChild(zoomInButton);
app.stage.addChild(zoomOutButton);

function createButton(path){
    var button = PIXI.Sprite.fromImage(path);
    button.interactive = true;
    button.buttonMode = true;
    return button;
}
