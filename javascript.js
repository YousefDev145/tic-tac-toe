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

const gameController = (function() {
    const players = [createPlayer("Xcalibur", "X"), createPlayer("Oracle", "O")];
    const getPlayers = () => players;

    let lastPlacement = null;
    return {getPlayers, lastPlacement};
})();

const xPlayer = gameController.getPlayers().filter(e => e.getMarker() == "X")[0];
const oPlayer = gameController.getPlayers().filter(e => e.getMarker() == "O")[0];
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
            for (let player of gameController.getPlayers()) {
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
        if (gameController.lastPlacement == marker) return `Not ${name}'s Turn!`;
        if (gameboard.getSquares()[position - 1] !== null) return `This square haas already been marked with ${gameboard.getSquares()[position - 1]}`;

        gameController.lastPlacement = marker;
        gameboard.getSquares()[position - 1] = marker;
        checkForWin(marker);
        return gameboard.getSquares();
    }

    const claimVictory = function() {
        console.log(`${name} claims victory!`);
    }
    
    return {getMarker, placeMarker, claimVictory};
}