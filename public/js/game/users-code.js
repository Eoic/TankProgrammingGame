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
    obj1.x += SPEED * Math.cos(obj1.rotation) * app.ticker.deltaTime;
    obj1.y += SPEED * Math.sin(obj1.rotation) * app.ticker.deltaTime;
}

/* Moves bot backwards. */
function moveBack(){
    obj1.x -= SPEED * Math.cos(obj1.rotation) * app.ticker.deltaTime;
    obj1.y -= SPEED * Math.sin(obj1.rotation) * app.ticker.deltaTime;
}

/* Turn turret. */
function turnTurret(){
    obj1.getChildAt(1).rotation += 0.1 * app.ticker.deltaTime;
}

/* Turn bot. */
function turn(degrees){

    if(degrees < getBotRotation())
        return;

    obj1.rotation += 0.1 * app.ticker.deltaTime;
}

/* Get turret rotation in degrees. */
function getTurretRotation(){
    return ((obj1.getChildAt(1).rotation * 180) / Math.PI) % 360;
}

/* Get bot rotation in degrees. */
function getBotRotation(){
    return ((obj1.rotation * 180) / Math.PI) % 360;
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
