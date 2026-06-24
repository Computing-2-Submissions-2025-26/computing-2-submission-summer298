/*jslint long*/
/*global describe, it, beforeEach*/

import Checkers from "../Checkers.js";
import assert from "assert";


const starting_board = [
    null, "0", null, "1", null, "2", null, "3",
    "4", null, "5", null, "6", null, "7", null,
    null, "8", null, "9", null, "10", null, "11",
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    "12", null, "13", null, "14", null, "15", null,
    null, "16", null, "17", null, "18", null, "19",
    "20", null, "21", null, "22", null, "23", null
];

describe("A checkers board contains pieces and empty squares", function () {

    beforeEach(function () {
        Checkers.board = starting_board.slice();
        Checkers.current_player = "cat";
        Checkers.kings = [];
    });

    it("An empty board contains 64 empty squares", function () {
        const board = Checkers.empty_board();

        assert.strictEqual(board.length, 64);
        assert.ok(board.every(function (square) {
            return square === null;
        }));
    });

    it("The starting board contains both cat pieces and dog pieces", function () {
        const cats = Checkers.board.filter(function (piece) {
            return Checkers.get_piece_player(piece) === "cat";
        });

        const dogs = Checkers.board.filter(function (piece) {
            return Checkers.get_piece_player(piece) === "dog";
        });

        assert.strictEqual(cats.length, 12);
        assert.strictEqual(dogs.length, 12);
    });

});

describe("Each piece belongs to one of the two players", function () {

    beforeEach(function () {
        Checkers.board = starting_board.slice();
        Checkers.current_player = "cat";
        Checkers.kings = [];
    });

    it("Pieces 0 to 11 belong to cats, and pieces 12 to 23 belong to dogs", function () {
        assert.strictEqual(Checkers.get_piece_player("0"), "cat");
        assert.strictEqual(Checkers.get_piece_player("11"), "cat");
        assert.strictEqual(Checkers.get_piece_player("12"), "dog");
        assert.strictEqual(Checkers.get_piece_player("23"), "dog");
    });

    it("An empty square does not belong to either player", function () {
        assert.strictEqual(Checkers.get_piece_player(null), null);
    });

});

describe("On your turn, you can only move your own pieces", function () {

    beforeEach(function () {
        Checkers.board = Checkers.empty_board();
        Checkers.current_player = "cat";
        Checkers.kings = [];
    });

    it("A player can move their own piece", function () {
        Checkers.board[17] = "0";
        Checkers.current_player = "cat";

        assert.strictEqual(Checkers.is_valid_move(17, 24), true);
    });

    it("A player cannot move the other player's piece", function () {
        Checkers.board[40] = "12";
        Checkers.current_player = "cat";

        assert.strictEqual(Checkers.is_valid_move(40, 33), false);
    });

});

describe("A normal piece moves one square diagonally forwards into an empty square", function () {

    beforeEach(function () {
        Checkers.board = Checkers.empty_board();
        Checkers.current_player = "cat";
        Checkers.kings = [];
    });

    it("A cat can move one square diagonally forwards", function () {
        Checkers.board[17] = "0";
        Checkers.current_player = "cat";

        assert.strictEqual(Checkers.is_valid_move(17, 24), true);
    });

    it("A dog can move one square diagonally forwards", function () {
        Checkers.board[40] = "12";
        Checkers.current_player = "dog";

        assert.strictEqual(Checkers.is_valid_move(40, 33), true);
    });

    it("A non-king piece cannot move sideways, backwards, or onto an occupied square", function () {
        Checkers.board[24] = "0";
        Checkers.current_player = "cat";

        assert.strictEqual(Checkers.is_valid_move(24, 25), false);
        assert.strictEqual(Checkers.is_valid_move(24, 17), false);

        Checkers.board[33] = "1";
        assert.strictEqual(Checkers.is_valid_move(24, 33), false);
    });

});

describe("A capture move jumps over an opponent's piece into an empty square", function () {

    beforeEach(function () {
        Checkers.board = Checkers.empty_board();
        Checkers.current_player = "cat";
        Checkers.kings = [];
    });

    it("A piece can capture an opponent by jumping over it", function () {
        Checkers.board[17] = "0";
        Checkers.board[26] = "12";
        Checkers.current_player = "cat";

        assert.strictEqual(Checkers.is_capture_move(17, 35), true);

        Checkers.board = Checkers.empty_board();
        Checkers.board[42] = "12";
        Checkers.board[33] = "0";
        Checkers.current_player = "dog";

        assert.strictEqual(Checkers.is_capture_move(42, 24), true);
    });

    it("A piece cannot capture its own piece or land on an occupied square", function () {
        Checkers.board[17] = "0";
        Checkers.board[26] = "1";
        Checkers.current_player = "cat";

        assert.strictEqual(Checkers.is_capture_move(17, 35), false);

        Checkers.board = Checkers.empty_board();
        Checkers.board[17] = "0";
        Checkers.board[26] = "12";
        Checkers.board[35] = "13";
        Checkers.current_player = "cat";

        assert.strictEqual(Checkers.is_capture_move(17, 35), false);
    });

    it("A non-king piece cannot capture backwards", function () {
        Checkers.board[35] = "0";
        Checkers.board[26] = "12";
        Checkers.current_player = "cat";

        assert.strictEqual(Checkers.is_capture_move(35, 17), false);
    });

});

describe("A piece becomes a king when it reaches the opposite side", function () {

    beforeEach(function () {
        Checkers.board = Checkers.empty_board();
        Checkers.current_player = "cat";
        Checkers.kings = [];
    });

    it("A cat becomes a king when it reaches the bottom row", function () {
        Checkers.board[49] = "0";
        Checkers.current_player = "cat";

        const moved = Checkers.move_piece(49, 56);

        assert.strictEqual(moved, true);
        assert.strictEqual(Checkers.is_king("0"), true);
    });

    it("A dog becomes a king when it reaches the top row", function () {
        Checkers.board[14] = "12";
        Checkers.current_player = "dog";

        const moved = Checkers.move_piece(14, 7);

        assert.strictEqual(moved, true);
        assert.strictEqual(Checkers.is_king("12"), true);
    });

    it("A piece is not a king before reaching the opposite side", function () {
        Checkers.board[17] = "0";
        Checkers.current_player = "cat";

        const moved = Checkers.move_piece(17, 24);

        assert.strictEqual(moved, true);
        assert.strictEqual(Checkers.is_king("0"), false);
    });

});

describe("A king can move and capture diagonally forwards or backwards", function () {

    beforeEach(function () {
        Checkers.board = Checkers.empty_board();
        Checkers.current_player = "cat";
        Checkers.kings = [];
    });

    it("A cat king can move diagonally backwards", function () {
        Checkers.board[24] = "0";
        Checkers.kings = ["0"];
        Checkers.current_player = "cat";

        assert.strictEqual(Checkers.is_valid_move(24, 17), true);
    });

    it("A dog king can move diagonally backwards", function () {
        Checkers.board[33] = "12";
        Checkers.kings = ["12"];
        Checkers.current_player = "dog";

        assert.strictEqual(Checkers.is_valid_move(33, 42), true);
    });

    it("A cat king can capture backwards", function () {
        Checkers.board[35] = "0";
        Checkers.board[26] = "12";
        Checkers.kings = ["0"];
        Checkers.current_player = "cat";

        const moved = Checkers.move_piece(35, 17);

        assert.strictEqual(moved, true);
        assert.strictEqual(Checkers.board[17], "0");
        assert.strictEqual(Checkers.board[35], null);
        assert.strictEqual(Checkers.board[26], null);
    });

    it("A dog king can capture backwards", function () {
        Checkers.board[28] = "12";
        Checkers.board[37] = "0";
        Checkers.kings = ["12"];
        Checkers.current_player = "dog";

        const moved = Checkers.move_piece(28, 46);

        assert.strictEqual(moved, true);
        assert.strictEqual(Checkers.board[46], "12");
        assert.strictEqual(Checkers.board[28], null);
        assert.strictEqual(Checkers.board[37], null);
    });

});

describe("When a move is made, the board updates", function () {

    beforeEach(function () {
        Checkers.board = Checkers.empty_board();
        Checkers.current_player = "cat";
        Checkers.kings = [];
    });

    it("A valid move places the piece in the new square and empties the old square", function () {
        Checkers.board[17] = "0";
        Checkers.current_player = "cat";

        const moved = Checkers.move_piece(17, 24);

        assert.strictEqual(moved, true);
        assert.strictEqual(Checkers.board[24], "0");
        assert.strictEqual(Checkers.board[17], null);
    });

    it("A valid capture removes the jumped-over piece", function () {
        Checkers.board[17] = "0";
        Checkers.board[26] = "12";
        Checkers.current_player = "cat";

        const moved = Checkers.move_piece(17, 35);

        assert.strictEqual(moved, true);
        assert.strictEqual(Checkers.board[35], "0");
        assert.strictEqual(Checkers.board[17], null);
        assert.strictEqual(Checkers.board[26], null);
    });

});

describe("The game ends when one player has no pieces left", function () {

    beforeEach(function () {
        Checkers.board = Checkers.empty_board();
        Checkers.current_player = "cat";
        Checkers.kings = [];
    });

    it("The game is not won while both players still have pieces", function () {
        Checkers.board[17] = "0";
        Checkers.board[40] = "12";

        assert.strictEqual(Checkers.is_victory(), false);
    });

    it("The game is won when either cats or dogs have no pieces left", function () {
        Checkers.board[17] = "0";

        assert.strictEqual(Checkers.is_victory(), true);

        Checkers.board = Checkers.empty_board();
        Checkers.board[40] = "12";

        assert.strictEqual(Checkers.is_victory(), true);
    });

});