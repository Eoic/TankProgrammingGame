// Execute game loop.
function execute() {
    if (!app.ticker.started){
        app.ticker.start();
        sendNotification('Simulation started...');
    }

    eval(`(function(){ 
             ${editor.getValue()}
             app.ticker.add(delta => update(delta));
          })()`);
}

// Stop game loop.
function stopGame() {
    sendNotification('Simulation has been stopped.')
    app.ticker.stop();
}