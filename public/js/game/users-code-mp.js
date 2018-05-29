/**
 * Run user code.
 */
function runCode(code){
    eval(code);
    app.ticker.add(gameLoop);
}

/**
 * Moves bot forwards.
 */
function moveForward(){
    socket.emit('move forward', getDelta());
}

function moveBack(){
    socket.emit('move back', getDelta());
}

function getDelta(){
    return app.ticker.deltaTime;
}

/**
 * Updates playerRobot data.
 */
socket.on('update', (data) => {
    updateGameObject(data);
});

socket.on('enemy update', (data) => {
    updateGameObject(data);
});

function updateGameObject(data){
    if(data.priority === 'playerOne'){
        gameObjects.playerRobot.position.set(data.posX, data.posY);
    } else gameObjects.enemyRobot.position.set(data.posX, data.posY);
}