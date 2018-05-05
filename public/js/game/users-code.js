// Execute game loop.
function execute() {
    if (!app.ticker.started){
        app.ticker.start();
        setGameState(true);

        eval(`(function(){ 
            ${editor.getValue()}
            startGame();
            app.ticker.add(delta => update(delta)); // Should be added only once or removed after game is stopped.
         })()`);
    } else
        restart();
}

// Stop game loop.
function stopGame() {
    setGameState(false);
    app.ticker.stop();
}

function restart(){
    app.ticker.stop();
    app.ticker.start();
}