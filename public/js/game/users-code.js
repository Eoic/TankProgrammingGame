var socket = io();

/**
 * Runs game loop.
 */
function execute() {
    app.ticker.start();
    setGameState(true);

    if(window.gameLoopFn){
        app.ticker.remove(window.gameLoopFn);
    }

    eval(editor.getValue());
    
    if(typeof gameLoop !== 'undefined'){
        window.gameLoopFn = gameLoop;
        app.ticker.add(gameLoop).add(gameLogic);
    }
}

/**
 * Stops game loop.
 */
function stopGame() {
    setGameState(false);

    if(window.gameLoopFn){
        app.ticker.remove(window.gameLoopFn);     
    }
}

// ### GAME API ###

/* Moves bot forwards. */
function moveForward(){
    socket.emit('move forward', getDelta());
}

/* Moves bot backwards. */
function moveBack(){
    socket.emit('move back', getDelta());
}

/* Turn turret. */
function rotateTurret(){
    socket.emit('rotate turret', {
        rot: obj1.getChildAt(1).rotation, 
        delta: app.ticker.deltaTime
    });
}

/* Turn bot to specified degrees. */
function rotateBot(degrees){
    socket.emit('rotate bot',   { degrees: degrees,
                                  delta: getDelta() }); 
}

/* Get turret rotation in degrees.
 */
function getTurretRotation(){
    return ((obj1.getChildAt(1).rotation * 180) / Math.PI) % 360;
}

/* Rotate and move towards target. */
function moveToPoint(target, offset){
    if(target.x !== null && target.y !== null){
        
    }
}

/* Get distance from given target object. */
function distanceFrom(target){
    if(target.x == null || target.y == null)
        return;

    return Math.sqrt(Math.pow(target.x - obj1, 2) + Math.pow(target.y - obj1.y, 2));
}

/* Return robot health. */
function getHealth(){
    return botHp;
}

/* --- Responses from SocketIO -- */

socket.on('move response', (data) => {
    obj1.x = data.posX;
    obj1.y = data.posY;
});

socket.on('rotate turret resp', (data) => {
    obj1.getChildAt(1).rotation = data.rot;
});

socket.on('rotate resp', (data) => {
    obj1.rotation = data.rot;
});

/* Misc */
function getBotData(){
    return {
        rot: obj1.rotation,
        posX: obj1.x, 
        posY: obj1.y,
        delta: app.ticker.deltaTime
    }
}

function getDelta() {
    return app.ticker.deltaTime;
}

/**
 * Updates robot data.
 */
socket.on('update', (data) => {
    obj1.x = data.posX;
    obj1.y = data.posY;
    obj1.rotation = data.rotation;
});