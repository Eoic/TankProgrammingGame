// Make client side connection.
var socket = io.connect();

var connected = false;
var $lobbySize = $('#playersCount');
var $name = $('#user');
var $joinGame = $('#joinGame');
var $leaveGame = $('#leaveGame');
var $lobbyWindow = $('#lobby-window')

var $createdGameInfo = $('#created-game-info');
var $gameStatus = $('#game-status');
var $gameHost = $('#game-host');
var $gameId = $('#game-id');

var username;

// Set username for socket.io.
(function setUsername(){
    username = $.trim($name.text());
    if(username)
        socket.emit('add user', username);
})();

// Join existing game.
function joinGame(){
    socket.emit('joinGame');
}

// Socket events.
socket.on('login', function(data){
    connected = true;
    updateLobbySize(data.playersCount);
});

socket.on('player joined', function(data){
    updateLobbySize(data.playersCount);
});

socket.on('player left', function(data){
    updateLobbySize(data.playersCount);
});

socket.on('joinSuccess', function(data){
    displayGameInfo(data.gameId, data.username, 'Joined');
    createGameScreen();
});

socket.on('gameReady', function(data){
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

// --------------

function updateLobbySize(count){
    console.log('Updating lobby size. Players: ' + count);
    console.log($lobbySize);
    $lobbySize.text(count);
}

function displayGameInfo(gameId, host, status){
    $createdGameInfo.removeClass('no-display');
    $gameId.text('#' + gameId);
    $gameHost.text(host);
    $gameStatus.text(status);
}

function hideGameInfo(){
    $createdGameInfo.addClass('no-display');
}

function createGameScreen(){
    $lobbyWindow.addClass('no-display');
    resizeSceneToFit();
}