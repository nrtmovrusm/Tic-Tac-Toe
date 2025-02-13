const btnSquares = document.querySelectorAll(".btnSquare");
const gameInstructions = document.querySelector(".gameplay-instructions");
const winnerAnnouncement = document.querySelector(".winner-announcement");
const changeNames = document.querySelector(".changeNames");
const changeNamesDialog = document.querySelector("#changePlayerNames");
const player1Var = document.querySelector("#player1");
const player2Var = document.querySelector("#player2");
const confirmNamesBtn = document.querySelector("#confirm");
const cancelDialogBtn = document.querySelector("#cancel");
const form = document.querySelector("form");
const nameOfPlayersBox = document.querySelector(".name-of-players");

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
        gameInstructions.textContent = `${player1.name}'s Turn`;
        winnerAnnouncement.textContent = "";
        nameOfPlayersBox.textContent = "";

        return gameboard;
    }

    // start the game with new gameboard
    resetGameBoard();
    gameInstructions.textContent = `${player1.name}'s Turn`;

    // select index of array where addMarker can be run 
    // add marker of currentPlayer
    function playTurn(index) {
        if (gameboard[index] == 0) {
            gameboard[index] = currentPlayer.marker;
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
                gameInstructions.textContent = `${player2.name}'s Turn`;
                break;
            } else {
                currentPlayer = player1;
                gameInstructions.textContent = `${player1.name}'s Turn`;
                break;
            }
        }

        if (winner == 1 || winner == 2) {
            gameInstructions.textContent = "Game has ended.";
            
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
                winner = 1;
                return;
            // check if all "0" empty squares have been taken and no winner
            } else if (!gameboard.some(square => square === 0)) {
                winnerAnnouncement.textContent = `Tie game!`;
                gameInstructions.textContent = "Tie game!";
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

    return { resetGameBoard, playTurn, switchPlayer, getWinner, getCurrentPlayerMarker, player1, player2, currentPlayer }
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

// changeNames button opens up the dialog with the form 
changeNames.addEventListener("click", () => {
    changeNamesDialog.showModal();
})

let oldPlayer1 = game.player1.name;
let oldPlayer2 = game.player2.name;

// Cancel button triggers close of dialog due to formmethod = "dialog" in HTML
// Default value is the value of the confirmNamesBtn prior to name changes
changeNamesDialog.addEventListener("close", () => {
    nameOfPlayersBox.textContent = changeNamesDialog.returnValue === `default` 
    ? `No names were changed. Player names: ${oldPlayer1} and ${oldPlayer2}` 
    : `Player names: ${changeNamesDialog.returnValue}`; 

    if (gameInstructions.textContent == `${oldPlayer1}'s Turn`) {
        gameInstructions.textContent = `${player1Var.value}'s Turn`;
    } else {
        gameInstructions.textContent = `${player2Var.value}'s Turn`;
    }
})

confirmNamesBtn.addEventListener("click", (event) => {
    event.preventDefault(); // prevent default submit action of buttons

    if (!form.checkValidity()) {
        alert("Please fill out all of the required elements.");
    } else {
        oldPlayer1 = game.player1.name;
        oldPlayer2 = game.player2.name;
        game.player1.name = player1Var.value;
        game.player2.name = player2Var.value;

        changeNamesDialog.close(`${game.player1.name} and ${game.player2.name}.`);
    }
})

cancelDialogBtn.addEventListener("click", () => {
    // return's previously confirmed names
    player1Var.value = game.player1.name;
    player2Var.value = game.player2.name;
    oldPlayer1 = game.player1.name;
    oldPlayer2 = game.player2.name;
    changeNamesDialog.close(`default`);
})