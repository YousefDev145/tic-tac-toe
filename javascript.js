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
    const players = [{name: "Xcalibur", marker: "X", points: 0}, {name: "Oracle", marker: "O", points: 0}];
    let activePlayer = players[0];
    let roundEnded = false;
    let threeConnected = false;
    let winner = null;
    let currentRound = 1;

    const resetGame = function() {
        activePlayer = players[0];
        roundEnded = false;
        threeConnected = false;
        winner = null;
        gameboard.reset();
    }

    const switchPlayerTurn = function() {
        activePlayer = activePlayer == players[0] ? players[1] : players[0];
    }

    const checkForWin = function() {
        let marker = activePlayer.marker;
        let squares = gameboard.getSquares();

        for (let i = 0; i < squares.length; i++) {
            switch (i + 1) {
                case 1:
                    if (squares[i] == marker && squares[i + 1] == marker && squares[i + 2] == marker) {
                        threeConnected = true;
                    }

                    if (squares[i] == marker && squares[i + 4] == marker && squares[i + 8] == marker) {
                        threeConnected = true;
                    }

                case 2:
                case 3:
                    if (squares[i] == marker && squares[i + 3] == marker && squares[i + 6] == marker) {
                        threeConnected = true;
                    }

                    if (squares[i] == marker && squares[i + 2] == marker && squares[i + 4] == marker) {
                        threeConnected = true;
                    }
                break;
        
                case 4:
                case 7:
                    if (squares[i] == marker && squares[i + 1] == marker && squares[i + 2] == marker) {
                        threeConnected = true;
                    }
                break;
            }

            if (threeConnected) {
                roundEnded = true;
                winner = activePlayer;
                winner.points++;
                screenController.showReplayButton();
                return;
            }
            else if (squares.filter(e => e == null).length == 0) {
                roundEnded = true;
                screenController.showReplayButton();
                return;
            }
        }
    }

    const startNewGame = function() {
        resetGame();
        currentRound++;
    }

    const playTurn = function(postion) {
        if (roundEnded) {
            console.log("The game has ended!");
            return;
        }

        if (gameboard.getSquares()[postion] != null) {
            console.log(`This square is already marked with ${gameboard.getSquares()[postion]}`);
            return;
        } 

        gameboard.placeMarker(activePlayer.marker, postion);
        checkForWin();
        if (!roundEnded) switchPlayerTurn();
        screenController.updateDisplay();
    }

    const getState = function() {
        if (roundEnded) {
            if (threeConnected) {
                return `The winner is ${winner.name}!`;
            }
            else {
                return "It's a tie!";
            }
        }
        else {
            return `It's ${activePlayer.name}'s turn...`
        }
    }
    
    const getCurrentRound = () => currentRound;

    const getPlayerName = index => players[index].name;
    const getPlayerPoints = index => players[index].points;

    return {playTurn, getState, getCurrentRound, getPlayerName, getPlayerPoints, startNewGame};
})();

const screenController = (function() {
    const turnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const currentRoundDiv = document.querySelector(".current-round");
    const player1PointsDiv = document.querySelector(".player-1-points");
    const player2PointsDiv = document.querySelector(".player-2-points");

    const replayBtn = document.querySelector(".replay");
    replayBtn.addEventListener("click", () => {
        gameController.startNewGame();
        updateDisplay();
        replayBtn.setAttribute("hidden", "");
    });

    const updateDisplay = function() {
        turnDiv.textContent = gameController.getState();
        boardDiv.textContent = "";
        currentRoundDiv.textContent = `Round ${gameController.getCurrentRound()}`;
        player1PointsDiv.textContent = `${gameController.getPlayerName(0)}: ${gameController.getPlayerPoints(0)}`;
        player2PointsDiv.textContent = `${gameController.getPlayerName(1)}: ${gameController.getPlayerPoints(1)}`;

        for (let row = 0; row < 3; row++) {
            for (let square = 0; square < 3; square++) {
                const newSquare = document.createElement("button");
                newSquare.classList.add("square");
                const index = row * 3 + square;
                newSquare.dataset.index = index;
                newSquare.textContent = gameboard.getSquares()[index];
                newSquare.addEventListener("click", () => {
                    gameController.playTurn(index);
                })

                switch(row) {
                    case 0:
                        newSquare.classList.add("top");
                    break;

                    case 2:
                        newSquare.classList.add("bottom");
                    break;
                }

                switch(square) {
                    case 0:
                        newSquare.classList.add("left");
                    break;

                    case 2:
                        newSquare.classList.add("right");
                    break;
                }

                boardDiv.appendChild(newSquare);
            }
        }
    }
    updateDisplay();

    const showReplayButton = function() {
        replayBtn.removeAttribute("hidden");
    }

    return {updateDisplay, showReplayButton};
})();