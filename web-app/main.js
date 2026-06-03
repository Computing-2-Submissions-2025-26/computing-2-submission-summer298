import R from "./ramda.js";
import Checkers from "./Checkers.js";


const image_sources = [
    "./assets/soil.png",
    "./assets/greengrass.png",
    "./assets/cat.png",
    "./assets/lion.png",
    "./assets/dog.png",
    "./assets/wolf.png",
];

const image_alts = [
    "Empty brown square",
    "Empty green square",
    "Cat",
    "Lion",
    "Dog",
    "Wolf"
];

const player_types = {
    "1" : "Felines",
    "2" : "Canines"
}

const game_board = document.getElementById("game_board");


const result_dialog = document.getElementById("result_dialog"); 

// Home player / away player are displayed on the left / right sidebars.
// Player 1 / Player 2 go first / second. These alternate each game.
let home_player = document.getElementById("home_name").value;
let away_player = document.getElementById("away_name").value;
let home_player_type;

let board = [
    [0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
];

let game = document.getElementById("game");
let player = 1;

build_board()