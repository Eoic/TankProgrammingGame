var socket = io();

// Execute game loop.
function execute() {
    app.ticker.start();
    setGameState(true);

    if(window.updateFn)
        app.ticker.remove(window.updateFn);

    eval(editor.getValue());

    window.updateFn = update;
    app.ticker.add(update);
}

function executeInVM(){
    socket.emit('run code', {
        code: bot.x
    });
}

socket.on('server response', function(data){
    bot.x = data.result;
});

// Stop game loop.
function stopGame() {
    setGameState(false);

    if(window.updateFn)
        app.ticker.remove(window.updateFn);
}

// ### GAME API HERE ###
function moveAhead(distance){
    bot.x = bot.x + SPEED * Math.cos(bot.rotation);
    bot.y = bot.y + SPEED * Math.sin(bot.rotation);
}

function moveBack(distance){
    bot.x = bot.x - (SPEED * Math.cos(bot.rotation));
    bot.y = bot.y - (SPEED * Math.sin(bot.rotation));
}

function moveToPoint(target){
    if(target.x !== null && target.y !== null){
        
    }
}

function distance(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// ---------------------
