const btnSquares = document.querySelectorAll(".btnSquare");
const gameInstructions = document.querySelector(".gameplay-instructions");
const winnerAnnouncement = document.querySelector(".winner-announcement");

function GameBoard() {

    let gameboard = [];

    let player1 = {
        name: "Player 1", 
        marker: "X",
    }

    let player2 = {
        name: "Player 2",
        marker: "O",
    }

    let winner = 0;
    
    // Player 1 goes first 
    let currentPlayer = player1;

    function resetGameBoard() {
        gameboard = [];
        for (let i=0; i < 9; i++) {
            gameboard.push(0);
        }
        winner = 0;
        currentPlayer = player1;

        btnSquares.forEach(button => button.textContent = "");
        btnSquares.forEach(button => button.disabled = false);
        gameInstructions.textContent = "Player 1's Turn.";
        winnerAnnouncement.textContent = "";

        return gameboard;
    }

    // start the game with new gameboard
    resetGameBoard();
    gameInstructions.textContent = "Player 1's Turn";

    // select index of array where addMarker can be run 
    // add marker of currentPlayer
    function playTurn(index) {
        if (gameboard[index] == 0) {
            gameboard[index] = currentPlayer.marker;
            console.log(gameboard);
        } else {
            gameInstructions.textContent = "Square is taken. Pick another square.";
            if (currentPlayer === player1) {
                currentPlayer = player2;
            } else {
                currentPlayer = player1;
            }
        }
    }

    function switchPlayer() {

        // after player has added their marker and before next player's turn, check the game status to see if game has ended
        checkGameStatus();

        while (winner == 0) {
            if (currentPlayer === player1) {
                currentPlayer = player2;
                gameInstructions.textContent = "Player 2's Turn.";
                console.log("Player 2's Turn");
                break;
            } else {
                currentPlayer = player1;
                gameInstructions.textContent = "Player 1's Turn.";
                console.log("Player 1's Turn");
                break;
            }
        }

        if (winner == 1 || winner == 2) {
            gameInstructions.textContent = "Game has ended.";
            console.log("Game has ended.");
            
            //disable all buttons after game has concluded
            btnSquares.forEach(button => {
                button.disabled = true;
            })
        }
    }

    function checkGameStatus() {
        // if someone has won.
        if (
            (gameboard[0] === gameboard[1] && gameboard[1] === gameboard[2] && gameboard[0] !== 0) ||
            (gameboard[3] === gameboard[4] && gameboard[4] === gameboard[5] && gameboard[3] !== 0) ||
            (gameboard[6] === gameboard[7] && gameboard[7] === gameboard[8] && gameboard[6] !== 0) ||
            (gameboard[0] === gameboard[4] && gameboard[4] === gameboard[8] && gameboard[0] !== 0) ||
            (gameboard[2] === gameboard[4] && gameboard[4] === gameboard[6] && gameboard[6] !== 0) ||
            (gameboard[0] === gameboard[3] && gameboard[3] === gameboard[6] && gameboard[6] !== 0) ||
            (gameboard[1] === gameboard[4] && gameboard[4] === gameboard[7] && gameboard[7] !== 0) ||
            (gameboard[2] === gameboard[5] && gameboard[5] === gameboard[8] && gameboard[8] !== 0)) {
                let winningPlayer = currentPlayer.name;
                winnerAnnouncement.textContent = `Congrats! ${winningPlayer} has won!`;
                console.log(`Congrats! ${currentPlayer.name} has won!`);
                winner = 1;
                return;
            // check if all "0" empty squares have been taken and no winner
            } else if (!gameboard.some(square => square === 0)) {
                winnerAnnouncement.textContent = `Tie game!`;
                gameInstructions.textContent = "Tie game!";
                console.log("Tie game!");
                winner = 2;
                return;
            } else {
                return;
            }
    }

    function getWinner() {
        return winner;
    }

    function getCurrentPlayerMarker() {
        return currentPlayer.marker;
    }

    return { resetGameBoard, playTurn, switchPlayer, getWinner, getCurrentPlayerMarker }
}

let game = GameBoard();
game.resetGameBoard(); // start game with empty board 

btnSquares.forEach(button => {
    button.addEventListener("click", (e) => {
        let index = Number(e.target.id);
        if (e.target.textContent == "") {
            e.target.textContent = `${game.getCurrentPlayerMarker()}`;
        }
        gameFlow(index);
    })
})

function gameFlow(btnIndex) {
    game.playTurn(btnIndex);
    game.switchPlayer();
}

const resetBtn = document.querySelector(".resetBtn");

resetBtn.addEventListener("click", () => {
    game.resetGameBoard()
});