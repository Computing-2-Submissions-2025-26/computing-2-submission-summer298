import Checkers from "./Checkers.js";

// click first square = choose a piece
// click second square = choose where to move
// call checkers.move_piece(from_index, to_index)
// if move worked, update HTML board
// check victory
// switch turn
// update player panel colour

let selected_index = null;

// String literals.

const result_text = {
    cat: "The feline family have won",
    dog: "The canine family have won"
};

const player_types = {
    "1": "cats",
    "2": "dogs"
};

// letting js know each square of the board
const squares = document.querySelectorAll("#game td");

console.log("main.js loaded")
console.log("Number of squares found", squares.length);

const clear_selected_square = function () {
    squares.forEach(function (square) {
        square.classList.remove("selected");
    });
};

const update_html_board = function () {
    squares.forEach(function (square, index) {
        const piece = Checkers.board[index];

        square.classList.remove("catpiece", "dogpiece", "selected");
        square.removeAttribute("id");

        if (piece === null) {
            return;
        }

        square.id = piece;

        if (Checkers.get_piece_player(piece) === "cat") {
            square.classList.add("catpiece");
        }

        if (Checkers.get_piece_player(piece) === "dog") {
            square.classList.add("dogpiece");
        }
    });
};

const update_turn_display = function () {
    const player1 = document.getElementById("player1");
    const player2 = document.getElementById("player2");

    if (Checkers.current_player === "cat") {
        player1.classList.add("active");
        player2.classList.remove("active");
    } else {
        player2.classList.add("active");
        player1.classList.remove("active");
    }
};


const show_result = function () {
    const result = document.getElementById("result");

    result.textContent = result_text[Checkers.current_player];
};

const handle_square_click = function (event) {
    const clicked_square = event.target;
    const clicked_index = Array.from(squares).indexOf(clicked_square);

    if (clicked_index === -1) {
        return;
    }

    if (selected_index === null) {
        const piece = Checkers.board[clicked_index];

        if (piece === null) {
            return;
        }

        if (Checkers.get_piece_player(piece) !== Checkers.current_player) {
            return;
        }

        selected_index = clicked_index;
        clicked_square.classList.add("selected");
        return;
    }

    
    const move_worked = Checkers.move_piece(selected_index, clicked_index);

    clear_selected_square();

    if (move_worked) {
        update_html_board();

        if (Checkers.is_victory()) {
            show_result();
            selected_index = null;
            return;
        }

        Checkers.switch_turn();
        update_turn_display();
    }

    selected_index = null;
};

squares.forEach(function (square) {
    square.onclick = handle_square_click;
});

update_html_board();
update_turn_display();
