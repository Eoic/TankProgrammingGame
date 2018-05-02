class GameLogger {

    constructor(){
        this.consoleObj = document.getElementById("console");
    }

    log(message) {
        var msg = document.createElement('p');
        msg.className = "mb-0 text-light game-log";
        msg.innerText = message;
        this.consoleObj.appendChild(msg);
    }
}