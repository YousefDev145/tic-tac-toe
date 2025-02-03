const gameboard = (function() {
    const squares = [];
    const reset = function() {
        squares.splice(0, squares.length);
        for (let i = 0; i < 9; i++) {
            squares.push(null);
        }
        return squares;
    }
    reset();
    const getSquares = function() {
        return squares;
    }
    return {getSquares, reset};
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
    for (let i = 0; i < gameboard.getSquares().length; i++) {
        let threeInARow = false;
        switch (i + 1) {
            case 1:
            case 2:
            case 3:
                if (gameboard.getSquares()[i] == marker && gameboard.getSquares()[i + 3] == marker && gameboard.getSquares()[i + 6] == marker) {
                    threeInARow = true;
                    break;
                }
    
            case 1:
            case 4:
            case 7:
                if (gameboard.getSquares()[i] == marker && gameboard.getSquares()[i + 1] == marker && gameboard.getSquares()[i + 2] == marker) {
                    threeInARow = true;
                    break;
                }
    
            case 1:
                if (gameboard.getSquares()[i] == marker && gameboard.getSquares()[i + 4] == marker && gameboard.getSquares()[i + 8] == marker) {
                    threeInARow = true;
                    break;
                }
    
            case 3:
                if (gameboard.getSquares()[i] == marker && gameboard.getSquares()[i + 2] == marker && gameboard.getSquares()[i + 4] == marker) {
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
        if (gameboard.getSquares()[position - 1] !== null) return `This square haas already been marked with ${gameboard.getSquares()[position - 1]}`;

        gameFlow.lastPlacement = marker;
        gameboard.getSquares()[position - 1] = marker;
        checkForWin(marker);
        return gameboard.getSquares();
    }

    const claimVictory = function() {
        console.log(`${name} claims victory!`);
    }
    
    return {getMarker, placeMarker, claimVictory};
}