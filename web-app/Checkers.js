import R from "./ramda.js";

/**
 * @namespace Checkers
 * @author Hanan
 */

const Checkers = Object.create(null);

/**
 * A Board is an 8 by 8 grid of squares.
 * It is implemented as an array of rows.
 * Each square contains a piece or an empty position.
 * @memberof Checkers
 * @typedef {Checkers.Piece_or_empty[][]} Board
 */

/**
 * A piece is a checker that belongs to one of the two players.
 * Regular pieces can move diagnonally forwards, while kings can move diagonally forwards and backwards.
 * @memberof Checkers
 * @typedef {(1 | 2 | 3 | 4)} Piece
 */

/**
 * Either a checker piece or an empty square.
 * @memberof Checkers
 * @typedef {(Checkers.Piece | 0)} Piece_or_empty
 */

/**
 * Template piece strings for {@link Checkers.to_string_with_pieces}.
 * @memberof Checkers
 * @enum {string[]}
 * @property {string[]} default ["0", "1", "2", "3", "4"]
 * Displays pieces by their index.
 * @property {string[]} tokens ["▪️", "🔴", "🔵", "🟥", "🟦"] 
 * Displays pieces as checker symbols.
 * @property {string[]} pets ["▪️", "🐈", "🐕", "🦁", "🐺"]
 */
Checkers.piece_strings = Object.freeze({
    "default" : ["0", "1", "2", "3", "4"],
    "tokens" : ["▪️", "🔴", "🔵", "🟥", "🟦"],
    "pets" : ["▪️", "🐈", "🐕", "🦁", "🐺"]
});

/**
 * Create empty 8x8 board
 * @memberof Checkers
 * @function
 * @param {number} [width] = 8
 * @param {number} [height] = 8
 * @returns {Checkers.Board} the empty board at the start
 */

/**Checkers.empty_board = function (width = 8, height = 8) {
    return R.repeat(R.repeat(0, height), width);
};
*/

/**Create the starting 8x8 board
 * @memberof Checkers
 * @property 
 * 
 * 0 is empty square
 * -1 is player 1 counter
 * 1 is player 2 counter
 */

function build_board() {
  game.innerHTML = "";
  let black = 0;
  let white = 0;
  for (let i = 0; i < board.length; i++) {
    const element = board[i];
    let row = document.createElement("div"); // create div for each row
    row.setAttribute("class", "row");

    for (let j = 0; j < element.length; j++) {
      const elmt = element[j];
      let col = document.createElement("div"); // create div for each case
      let piece = document.createElement("div");
      let caseType = "";
      let occupied = "";

      if (i % 2 === 0) {
        if (j % 2 === 0) {
          caseType = "Whitecase";
        } else {
          caseType = "blackCase";
        }
      } else {
        if (j % 2 !== 0) {
          caseType = "Whitecase";
        } else {
          caseType = "blackCase";
        }
      }

      // add the piece if the case isn't empty
      if (board[i][j] === 1) {
        occupied = "whitePiece";
      } else if (board[i][j] === -1) {
        occupied = "blackPiece";
      } else {
        occupied = "empty";
      }

      piece.setAttribute("class", "occupied " + occupied);

      // set row and colum in the case
      piece.setAttribute("row", i);
      piece.setAttribute("column", j);
      piece.setAttribute("data-position", i + "-" + j);

      //add event listener to each piece
      piece.addEventListener("click", movePiece);

      col.appendChild(piece);

      col.setAttribute("class", "column " + caseType);
      row.appendChild(col);

      // counter number of each piece
      if (board[i][j] === -1) {
        black++;
      } else if (board[i][j] === 1) {
        white++;
      }

      //display the number of piece for each player
      displayCounter(black, white);
    }

    game.appendChild(row);
  }

  if (black === 0 || white === 0) {
    modalOpen(black);
  }
}


export default Object.freeze(Checkers);