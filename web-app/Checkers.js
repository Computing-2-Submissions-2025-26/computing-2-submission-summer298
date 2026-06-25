/**
 * Checkers.js is a module to model and play Checkers
 * @namespace Checkers
 * @author Hanan Kara
 */

const Checkers = Object.create(null);

/**
 * A piece is represented by its HTML id
 * @memberof Checkers
 * @typedef {string} Piece
 */

/**
 * A board square contains either a piece id or null
 * null = empty square
 * string = piece id
 * @memberof Checkers
 * @typedef {(Checkers.Piece | null)} Piece_or_empty
 */

/**
 * A board is a single array of 64 positions
 * @memberof Checkers
 * @typedef {Checkers.Piece_or_empty[]} Board
 */

/**
 * Current board state
 * @memberof Checkers
 * @type {Checkers.Board}
 */

Checkers.board = [
  null, "0", null, "1", null, "2", null, "3",
  "4", null, "5", null, "6", null, "7", null,
  null, "8", null, "9", null, "10", null, "11",
  null, null, null, null, null, null, null, null,
  null, null, null, null, null, null, null, null,
  "12", null, "13", null, "14", null, "15", null,
  null, "16", null, "17", null, "18", null, "19",
  "20", null, "21", null, "22", null, "23", null
];

/**
 * Creates an empty board
 * @memberof Checkers
 * @returns {Checkers.Board} - empty board with 64 null values
 */

Checkers.empty_board = function () {
  return new Array(64).fill(null);
};

/**
 * Determines which player a piece belongs to
 * @memberof Checkers
 * @param {Checkers.Piece_or_empty} piece - the piece id or null
 * @returns {"cat" | "dog" | null} - player who owns the piece or null if empty
 */
Checkers.get_piece_player = function (piece) {
  if (piece === null) {
    return null;
  }
  const piece_number = Number(piece);
  if (piece_number >= 0 && piece_number <=11) {
    return "cat";
  }
  if (piece_number >= 12 && piece_number <= 23) {
    return "dog";
  }
  return null;
};

/**
 * The player whose turn it currently is
 * @memberof Checkers
 * @type {"cat" | "dog"}
 */
Checkers.current_player = "cat";

/**
 * Finds the board index of a piece
 * @memberof Checkers
 * @param {Checkers.Piece} piece - the piece id to search for
 * @returns {number} - board index of the piece, or -1 if it is not found
 */
Checkers.get_piece_position = function (piece) {
  return Checkers.board.indexOf(piece);
};

/**
 * Checks whether a board position is empty
 * @memberof Checkers
 * @param {number} index - the board position to check
 * @returns {boolean} - true if the position is empty, otherwise false
 */
Checkers.is_empty_position = function(index) {
  return Checkers.board[index] === null;
};

/**
 * List of piece ids that have become kings
 * @memberof Checkers
 * @type {Checkers.Piece[]}
 */
Checkers.kings = [];

/**
 * Checks whether a move is valid
 * Normal move: one square diagonally forwards
 * King move: one square diagonally forwards or backwards
 * Handles captures
 * @memberof Checkers
 * @param {number} from_index - current position
 * @param {number} to_index - new position
 * @returns {boolean} - true if the move is allowed, otherwise false
 */
Checkers.is_valid_move = function (from_index, to_index) {
  if (from_index < 0 || from_index > 63 || to_index < 0 || to_index > 63) {
    return false;
  }

  const piece = Checkers.board[from_index];

  if (piece === null) {
    return false;
  }

  if (!Checkers.is_empty_position(to_index)) {
    return false;
  }

  const player = Checkers.get_piece_player(piece);

  if (player !== Checkers.current_player) {
    return false;
  }

  const from_row = Math.floor(from_index / 8);
  const from_col = from_index % 8;

  const to_row = Math.floor(to_index / 8);
  const to_col = to_index % 8;

  const row_difference = to_row - from_row;
  const col_difference = Math.abs(to_col - from_col);

  if (col_difference === 1) {
    if (Checkers.is_king(piece) && Math.abs(row_difference) === 1) {
      return true;
    }

    if (player === "cat" && row_difference === 1) {
      return true;
    }

    if (player === "dog" && row_difference === -1) {
      return true;
    }
  }

  if (Checkers.is_capture_move(from_index, to_index)) {
    return true;
  }

  return false;
};

/**
 * Moves a piece from one board position to another
 * Removes captured piece if capture
 * Makes king if piece reaches opposite end
 * @memberof Checkers
 * @param {number} from_index - current position
 * @param {number} to_index - new position
 * @returns {boolean} - true if valid move and piece moved, otherwise false
 */
Checkers.move_piece = function (from_index, to_index) {
  if (!Checkers.is_valid_move(from_index, to_index)) {
      return false;
  }

  const was_capture = Checkers.is_capture_move(from_index, to_index);

  const piece = Checkers.board[from_index];

  Checkers.board[to_index] = piece;
  Checkers.board[from_index] = null;

  if (was_capture) {
    const from_row = Math.floor(from_index / 8);
    const from_col = from_index % 8;

    const to_row = Math.floor(to_index / 8);
    const to_col = to_index % 8;

    const captured_row = (from_row + to_row) / 2;
    const captured_col = (from_col + to_col) / 2;
    const captured_index = captured_row * 8 + captured_col;

    Checkers.capture_piece(captured_index);
  }

  if (Checkers.should_be_king(piece, to_index)) {
    Checkers.make_king(piece);
  }

  return true;
};

/**
 * Checks whether a piece is a king
 * @memberof Checkers
 * @param {Checkers.Piece_or_empty} piece - piece id or null
 * @returns {boolean} - true if piece is king, otherwise false
 */
Checkers.is_king = function (piece) {
  if(piece === null) {
    return false;
  }
  return Checkers.kings.includes(piece);
};

/**
 * Checks whether a move is a capture move
 * @memberof Checkers
 * @param {number} from_index - current position
 * @param {number} to_index - new position
 * @returns {boolean} - true if the move captures another piece, otherwise false
 */
Checkers.is_capture_move = function (from_index, to_index) {
  const piece = Checkers.board[from_index];

  if (piece === null) {
      return false;
  }

  if (!Checkers.is_empty_position(to_index)) {
      return false;
  }

  const player = Checkers.get_piece_player(piece);

  const from_row = Math.floor(from_index / 8);
  const from_col = from_index % 8;

  const to_row = Math.floor(to_index / 8);
  const to_col = to_index % 8;

  const row_difference = to_row - from_row;
  const col_difference = Math.abs(to_col - from_col);

  if (col_difference !== 2) {
      return false;
  }

  if (Checkers.is_king(piece)) {
    if (Math.abs(row_difference) !==2) {
      return false;
    }
  } else {
    if (player === "cat" && row_difference !==2) {
      return false;
    }
    if (player === "dog" && row_difference !== -2) {
      return false;
    }
  }

  const middle_row = (from_row + to_row) / 2;
  const middle_col = (from_col + to_col) / 2;
  const middle_index = middle_row * 8 + middle_col;

  const captured_piece = Checkers.board[middle_index];

  if (captured_piece === null) {
      return false;
  }

  const captured_player = Checkers.get_piece_player(captured_piece);

  return player !== captured_player;
};

/**
 * Gets the piece captured during a capture move
 * @memberof Checkers
 * @param {number} from_index - starting position
 * @param {number} to_index - ending position
 * @returns {Checkers.Piece_or_empty} - captured piece id or null if none
 */
Checkers.get_captured_piece = function (from_index, to_index) {
  if (!Checkers.is_capture_move(from_index, to_index)) {
      return null;
  }
  const from_row = Math.floor(from_index / 8);
  const from_col = from_index % 8;

  const to_row = Math.floor(to_index / 8);
  const to_col = to_index % 8;

  const captured_row = (from_row + to_row) / 2;
  const captured_col = (from_col + to_col) / 2;

  const captured_index = captured_row * 8 + captured_col;

  return Checkers.board[captured_index];
};

/**
 * Removes captured piece from the board
 * @memberof Checkers
 * @param {number} captured_index - board position of the captured piece
 * @returns {undefined} - no returned value
 */
Checkers.capture_piece = function (captured_index) {
    Checkers.board[captured_index] = null;
};

/**
 * Counts how many pieces a player has left on the board
 * @memberof Checkers
 * @param {"cat" | "dog"} player - player to count pieces for
 * @returns {number} - number of pieces the player has left
 */
Checkers.count_pieces = function (player) {
  return Checkers.board.filter(function (piece) {
    return Checkers.get_piece_player(piece) === player;
  }).length;
};

/**
 * Checks whether a piece should become a king
 * @memberof Checkers
 * @param {Checkers.Piece} piece - piece id to check
 * @param {number} index - position of the piece
 * @returns {boolean} - true if the piece should become a king, otherwise false
 */
Checkers.should_be_king = function (piece, index) {
  const player = Checkers.get_piece_player(piece);
  const row = Math.floor(index/8);

  if (player === "cat" && row === 7){
    return true;
  }
  if (player === "dog" && row === 0){
    return true;
  }
  return false;
};

/**
 * Makes a piece into a king
 * @memberof Checkers
 * @param {Checkers.Piece} piece - piece id to make king
 * @returns {undefined} - no returned value
 */
Checkers.make_king = function (piece) {
  if (!Checkers.kings.includes(piece)){
    Checkers.kings.push(piece);
  }
};

/**
 * Switches the current player
 * @memberof Checkers
 * @returns {"cat" | "dog"} - player whose turn it is after switch
 */
Checkers.switch_turn = function () {
  if (Checkers.current_player === "cat") {
      Checkers.current_player = "dog";
  } else {
      Checkers.current_player = "cat";
  }

  return Checkers.current_player;
};

/**
 * Check if a player has won
 * A player wins when the other has no pieces left
 * @memberof Checkers
 * @returns {boolean} - true if the game has been won, otherwise false
 */
Checkers.is_victory = function () {
  const cats_left = Checkers.board.some(function (piece) {
      return Checkers.get_piece_player(piece) === "cat";
  });

  const dogs_left = Checkers.board.some(function (piece) {
      return Checkers.get_piece_player(piece) === "dog";
  });

  return !cats_left || !dogs_left;
};

//export default Object.freeze(Checkers); commented out as broke unit tests

export default Checkers;