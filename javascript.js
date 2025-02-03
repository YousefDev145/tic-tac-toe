const gameboard = (function() {
    let squares = [];
    const reset = function() {
        squares = [];
        for (let i = 0; i < 9; i++) {
            squares.push(null);
        }
        return squares;
    }
    reset();
    return {squares, reset};
})();

const gameFlow = (function() {
    const players = [];
    const addPlayer = function(player) {
        if (player.length > 2) {
            console.log("There are already two players!");
            return;
        }
        players.push(player);
        return players;
    }

    let lastPlacement = null;
    return {players, addPlayer, lastPlacement};
})();

const playerX = createPlayer("Xcalibur", "X");
const playerO = createPlayer("Oracle", "O");
gameFlow.addPlayer(playerX);
gameFlow.addPlayer(playerO);

function checkForWin(marker) {
    for (let i = 0; i < gameboard.squares.length; i++) {
        let threeInARow = false;
        switch (i + 1) {
            case 1:
            case 2:
            case 3:
                if (gameboard.squares[i] == marker && gameboard.squares[i + 3] == marker && gameboard.squares[i + 6] == marker) {
                    threeInARow = true;
                    break;
                }
    
            case 1:
            case 4:
            case 7:
                if (gameboard.squares[i] == marker && gameboard.squares[i + 1] == marker && gameboard.squares[i + 2] == marker) {
                    threeInARow = true;
                    break;
                }
    
            case 1:
                if (gameboard.squares[i] == marker && gameboard.squares[i + 4] == marker && gameboard.squares[i + 8] == marker) {
                    threeInARow = true;
                    break;
                }
    
            case 3:
                if (gameboard.squares[i] == marker && gameboard.squares[i + 2] == marker && gameboard.squares[i + 4] == marker) {
                    threeInARow = true;
                    break;
                }
        }
        if (threeInARow) {
            for (let player of gameFlow.players) {
                if (player.getMarker() == marker) {
                    player.claimVictory();
                    return player;
                }
            }
        }
    }
}

function createPlayer(name, marker) {
    const getMarker = function() {
        return marker;
    }

    const placeMarker = function(position) {
        if (gameFlow.lastPlacement == marker) return `Not ${name}'s Turn!`;

        gameFlow.lastPlacement = marker;
        gameboard.squares[position - 1] = marker;
        checkForWin(marker);
        return gameboard.squares;
    }

    const claimVictory = function() {
        console.log(`${name} claims victory!`);
    }
    
    return {getMarker, placeMarker, claimVictory};
}