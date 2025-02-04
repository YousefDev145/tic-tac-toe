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

    const placeMarker = function(marker, position) {
        squares[position] = marker;
    }

    return {getSquares, reset, placeMarker};
})();

const gameController = (function() {
    const players = [{name: "Xcalibur", marker: "X"}, {name: "Oracle", marker: "O"}];
    let activePlayer = players[0];

    const switchPlayerTurn = function() {
        activePlayer = activePlayer == players[0] ? players[1] : players[0];
    }

    const checkForWin = function() {
        let marker = activePlayer.marker;
        let squares = gameboard.getSquares();

        for (let i = 0; i < squares.length; i++) {
            let threeConnected = false;
            switch (i + 1) {
                case 1:
                case 2:
                case 3:
                    if (squares[i] == marker && squares[i + 3] == marker && squares[i + 6] == marker) {
                        threeConnected = true;
                        break;
                    }
        
                case 1:
                case 4:
                case 7:
                    if (squares[i] == marker && squares[i + 1] == marker && squares[i + 2] == marker) {
                        threeConnected = true;
                        break;
                    }
        
                case 1:
                    if (squares[i] == marker && squares[i + 4] == marker && squares[i + 8] == marker) {
                        threeConnected = true;
                        break;
                    }
        
                case 3:
                    if (squares[i] == marker && squares[i + 2] == marker && squares[i + 4] == marker) {
                        threeConnected = true;
                        break;
                    }
            }

            if (threeConnected) {
                declareWinner(activePlayer);
                return;
            }
        }
    }

    const playRound = function(postion) {
        console.log(gameboard.getSquares()[postion]);
        if (gameboard.getSquares()[postion] != null) {
            console.log(`This square is already marked with ${gameboard.getSquares()[postion]}`);
            return;
        } 

        gameboard.placeMarker(activePlayer.marker, postion);
        console.log(gameboard.getSquares());
        checkForWin();
        switchPlayerTurn();
        screenController.updateDisplay();
    }

    const declareWinner = function(player) {
        console.log(`The Winner is ${player.name}!`);
        return player.name;
    }

    return {playRound};
})();

const screenController = (function() {
    const boardDiv = document.querySelector(".board");

    const updateDisplay = function() {
        boardDiv.textContent = "";
        
        for (let row = 0; row < 3; row++) {
            for (let square = 0; square < 3; square++) {
                const newSquare = document.createElement("button");
                newSquare.classList.add("square");
                const index = row * 3 + square;
                newSquare.dataset.index = index;
                newSquare.textContent = gameboard.getSquares()[index];
                newSquare.addEventListener("click", () => {
                    gameController.playRound(index);
                })
                boardDiv.appendChild(newSquare);
            }
        }
    }
    updateDisplay();

    return {updateDisplay};
})();