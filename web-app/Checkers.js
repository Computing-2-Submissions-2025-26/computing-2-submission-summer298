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

Checkers.empty_board = function (width = 8, height = 8) {
    return R.repeat(R.repeat(0, height), width);
};
