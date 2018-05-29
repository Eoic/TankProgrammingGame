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

function getDelta(){
    return app.ticker.deltaTime;
}

/**
 * Updates playerRobot data.
 */
socket.on('update', (data) => {
    
});