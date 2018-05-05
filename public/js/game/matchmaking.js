// Make client side connection.
var socket = io.connect();

var connected = false;
var $lobbySize = $('playersCount');
var $name = $('#user');
var $joinGame = $('#joinGame');
var $leaveGame = $('#leaveGame');
var $createGame = $('#createGame');
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

socket.on('joinSuccess', function(data){
    console.log('Successfully joined: ' + data.gameId);
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
    console.log('There is no game for joining.');
});

socket.on('gameDestroyed', function(){
    console.log(data.gameOwner + ' destroyed game: ' + data.gameId);
});

socket.on('gameCreated', function(data){
    console.log('Game created. ID is: ' + data.gameId);
    console.log(data.username + ' created game ' + data.gameId);
});

// Click events.
$joinGame.click(function(){
    console.log('Clicked Join Game button.');
    joinGame();
});

$leaveGame.click(function(){
    leaveGame();
});
// --------------

function updateLobbySize(count){
    $lobbySize.text(count);
}