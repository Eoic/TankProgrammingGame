var socket = io.connect();

var connected = false;                  /* Is player connected      */
var $lobbyWindow = $('#lobby-window')   /* Lobby window             */
var $lobbySize = $('#playersCount');    /* Lobby players counter    */
var $leaveGame = $('#leaveGame');       /* Disconnect from game.    */
var $joinGame = $('#joinGame');         /* Search / join game.      */
var $name = $('#user');                 /* Connected users username */

var $createdGameInfo = $('#created-game-info');
var $gameStatus = $('#game-status');
var $gameHost = $('#game-host');
var $gameId = $('#game-id');

var username = undefined;

/**
 * Sets players' username for socket.io on lobby enter.
 */
(function setUsername(){
    username = $.trim($name.text());
    if(username)
        socket.emit('add user', username);
})();

/**
 * Join existing game.
 */
function joinGame(){
    socket.emit('joinGame');
}

/* -- SocketIO events -- */
/**
 * On player login set player as connected
 * and update lobby size for everyone.
 */
socket.on('login', function(data){
    connected = true;
    updateLobbySize(data.playersCount);
    console.log('login event');
});

/**
 * Tell server that player joinen the game
 * and ...?
 */
socket.on('player joined', function(data){
    updateLobbySize(data.playersCount);
    console.log('Player joined event');
});

socket.on('player left', function(data){
    console.log('Player left event.');
    updateLobbySize(data.playersCount);
});

socket.on('joinSuccess', function(data){
    console.log('Join success event');
    displayGameInfo(data.gameId, data.host, 'Joined');
    createGameScreen();
});

socket.on('gameReady', function(data){
    console.log('Game ready event');
    if(data.data.playerOne === username)
        createGameScreen();
});

// Server response on existing user in the game.
socket.on('alreadyJoined', function(data){
    console.log('Already in existing game: ' + data.gameId);
});

function leaveGame(){
    socket.emit('leaveGame');
}

socket.on('leftGame', function(data){
    console.log('Leaving game: ' + data.gameId);
    displayGameInfo(undefined, undefined, 'Left');
});

socket.on('notInGame', function(){
    console.log('There is no game to leave.');
});

socket.on('gameDestroyed', function(data){
    console.log(data.gameOwner + ' destroyed game: ' + data.gameId);
    hideGameInfo();
});

socket.on('gameCreated', function(data){
    displayGameInfo(data.gameId, data.username, 'Created');
});

socket.on('disconnect', function(){
    console.log('User disconnected');
    hideGameInfo();
});

// Click events.
$joinGame.click(function(){
    console.log('Clicked Join Game button.');
    joinGame();
});
 
$leaveGame.click(function(){
    console.log('Clicked leave game');
    leaveGame();
});

// UI functions.
function updateLobbySize(count){
    console.log('Updating lobby size. Players: ' + count);
    console.log($lobbySize);
    $lobbySize.text(count);
}

function displayGameInfo(gameId, host, status){
    $createdGameInfo.removeClass('no-display');

    if(gameId !== undefined)
        $gameId.text('#' + gameId);

    if(host !== undefined)
        $gameHost.text(host);
    
    if(status !== undefined)
        $gameStatus.text(status);
}


function hideGameInfo(){
    $createdGameInfo.addClass('no-display');
}
 
function createGameScreen(){
    //$lobbyWindow.addClass('no-display');
    //resizeSceneToFit();
}