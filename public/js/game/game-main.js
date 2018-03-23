// Creating PIXI application.
let app = new PIXI.Application({antialias: true,
    resolution: 1
});

app.renderer.backgroundColor = 0x061639;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);
document.getElementById('display').appendChild(app.view);