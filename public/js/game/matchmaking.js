var socket = io.connect();

/**
 * Minumum number of players required to 
 * launch a game.
 */
const MIN_PLAYERS_REQUIRED = 2;

var currentGameID = '';
var gameReady = false;
var connected = false;                  /* Is player connected      */
var $lobbyWindow = $('#lobby-window')   /* Lobby window             */
var $lobbySize = $('#playersCount');    /* Lobby players counter    */
var $leaveGame = $('#leaveGame');       /* Disconnect from game.    */
var $joinGame = $('#joinGame');         /* Search / join game.      */
var $createGame = $('#createGame');     /* Creates new game.        */
var $name = $('#user');                 /* Connected users username */
var selectedRobotName;                  /* Name of selected robot.  */

var $createdGameInfo = $('#created-game-info');
var $gameStatus = $('#game-status');
var $gameHost = $('#game-host');
var $gameId = $('#game-id');
var $updateGamesList = $('#updateGamesList');

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
 * Request server for multiplayer games list.
 */
socket.emit('getCreatedGames');

/**
 * Update lobby from games list.
 */
socket.on('createdGamesList', (data) => {
    buildGameListTable(data);
});

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
});

/**
 * Tell server that player joined the game
 */
socket.on('player joined', function(data){
    updateLobbySize(data.playersCount);
});

socket.on('player left', function(data){
    console.log('Player left event.');
    updateLobbySize(data.playersCount);
});

socket.on('joinSuccess', function(data){
    socket.emit('getCreatedGames');
});

/**
 * Creates game screen if game is ready to play.
 */
socket.on('gameReady', function(data){
    if(data.data.playerOne === username || data.data.playerTwo === username){
        currentGameID = data.data['id'];
        selectRobotForGame();
        createGameScreen();
        socket.emit('beginGame');
    }
});

// Server response on existing user in the game.
socket.on('alreadyJoined', function(data){
    console.log('Already in existing game: ' + data.gameId);
});

function leaveGame(){
    socket.emit('leaveGame');
}

socket.on('leftGame', function(data){
    socket.emit('getCreatedGames');
});

socket.on('notInGame', function(){
    console.log('There is no game to leave.');
});

socket.on('gameDestroyed', function(data){
    console.log(data.gameOwner + ' destroyed game: ' + data.gameId);
});

socket.on('gameCreated', function(data){
    socket.emit('getCreatedGames');
});

socket.on('disconnect', function(){
    socket.emit('getCreatedGames');
    socket.emit('leaveGame');
});

$createGame.click(function(){
    joinGame();
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

/**
 * Update game list table on click.
 */
$updateGamesList.click(function(){
    socket.emit('getCreatedGames');
});

// UI functions.
function updateLobbySize(count){
    $lobbySize.text(count);
}

function createGameScreen(){
    $lobbyWindow.addClass('no-display');
    createGameScene();
}

/* GAME LIST TABLE GENERATION */
/**
 * Updates table with list of available or active games.
 * @param {Array} gameList 
 */
function buildGameListTable(gameList){
    var gameListTable = document.getElementById('gameListTable');
    var newTableBody = document.createElement('tbody');
    var oldTableBody = gameListTable.getElementsByTagName('tbody')[0]
    
    for(var i = 0; i < gameList.length; i++)
        newTableBody.appendChild(buildTableRow(gameList[i]['gameObject']));

    oldTableBody.parentNode.replaceChild(newTableBody, oldTableBody);
}

/**
 * Creates and returns single table row.
 * @param {Object} data 
 */
function buildTableRow(data){
    var playersInGame = getPlayersInGame(data);
    var status = (playersInGame == MIN_PLAYERS_REQUIRED) ? 'Active' : 'Available';
    var tableRow = document.createElement('tr');
    tableRow.appendChild(buildTableCell('game-id', '#' + data['id']));
    tableRow.appendChild(buildTableCell('game-status', status));
    tableRow.appendChild(buildTableCell('game-players', playersInGame + '/' + MIN_PLAYERS_REQUIRED));
    tableRow.appendChild(buildTableCell('game-action', '0'));
    return tableRow;
}

/**
 * Creates table <td> element with specified id
 * and text content.
 * @param {String} id 
 * @param {String} innerText 
 */
function buildTableCell(id, innerText){
    var td = document.createElement('td');
    td.id = id;
    td.innerText = innerText;
    return td;
}

/**
 * Returns number oj players connected in single game.
 * @param {Object} data 
 */
function getPlayersInGame(data){
    if(data['playerOne'] !== null && data['playerTwo'] !== null)
        return 2;
    else if(data['playerOne'] !== null || data['playerTwo'] !== null)
        return 1;
    
    return 0;
}

/**
 * Selects data for created game.
 */
function selectRobotForGame(){
    $.post("getRobotData", { robotname: selectedRobotName }).done(function(data) {
        socket.emit('initiate player', data);
        runCode(data.robot.code);
    });
}

$(function () {
    $('#list-tab a:first-child').tab('show')
});

/**
 * Sets selected robot name on click.
 */
$('a[data-toggle="list"]').on('shown.bs.tab', function (e) {
    selectedRobotName = e.target.innerText.trim();
});