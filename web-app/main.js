import R from "./ramda.js";

const board = document.querySelector("#board");
const statusText = document.querySelector("#status");

const boardSize = 8;

function isDarkSquare(row, column) {
  return (row + column) % 2 === 1;
}

function getStartingPiece(row, column) {
  if (!isDarkSquare(row, column)) {
    return null;
  }

  if (row < 3) {
    return "black";
  }

  if (row > 4) {
    return "red";
  }

  return null;
}

function drawBoard() {
  board.innerHTML = "";

  for (let row = 0; row < boardSize; row += 1) {
    for (let column = 0; column < boardSize; column += 1) {
      const square = document.createElement("button");

      square.classList.add("square");

      if (isDarkSquare(row, column)) {
        square.classList.add("dark");
      } else {
        square.classList.add("light");
      }

      const piece = getStartingPiece(row, column);

      if (piece !== null) {
        const pieceElement = document.createElement("div");

        pieceElement.classList.add("piece");

        if (piece === "black") {
          pieceElement.classList.add("black-piece");
        }

        if (piece === "red") {
          pieceElement.classList.add("red-piece");
        }

        square.append(pieceElement);
      }

      board.append(square);
    }
  }

  statusText.textContent = "Checkers board ready";
}

drawBoard();