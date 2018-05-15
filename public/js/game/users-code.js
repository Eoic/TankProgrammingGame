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
    app.ticker.stop();
}

// ### GAME API HERE ###
function moveAhead(distance){
    
}

function moveBack(distance){

}
// ---------------------