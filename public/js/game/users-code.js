var socket = io();

// Execute game loop.
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

// Stop game loop.
function stopGame() {
    setGameState(false);

    if(window.gameLoopFn){
        app.ticker.remove(window.gameLoopFn);     
    }
}

// ### GAME API HERE ###

/* Moves bot forwards. */
function moveAhead(){
    socket.emit('move ahead', getBotData());
}

/* Moves bot backwards. */
function moveBack(){
    socket.emit('move back', getBotData());
}

/* Turn turret. */
function rotateTurret(){
    socket.emit('rotate turret', {
        rot: obj1.getChildAt(1).rotation, 
        delta: app.ticker.deltaTime
    });
}

/* Turn bot. */
function rotateBot(degrees){

    if(Math.abs())

    socket.emit('rotate', {
        rot: obj1.rotation,
        deg: degrees,
        delta: app.ticker.deltaTime
    }); 
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