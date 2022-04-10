// Chris Martens
// Ported from .pde version, 2022-02-15

// Constants
const PIXEL_SIZE = 24;
//const ROCK = 0, FLOOR = 1, WALL = 2, ITEM = 3; //added item
//const START = -1, END = -2;
const ROOM_SIZE = 20;

// CA rule parameters
//const T1 = 5, T2 = 4;

// Global variables
let max_iters = 5;
let room;
let room_grid;
let player_pos, end_pos;
let key_buffer = [];

const basic_tile_enum = Object.freeze({
    rock: 0,
    floor: 1,
    wall: 2,
    player: -1,
    end: -2,
});

const basic_tile_scheme = Object.freeze({
    floor_color: "#ffffff", // black - can
    rock_color: "#000000", // white - can travel 1
    wall_color: "#858585", // med/dark grey
    player_color: "green",
    end_color: "red",
});

var cnv;

function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    cnv.position(x, y);
}

function windowResized() {
    centerCanvas();
}

function setup() {
    cnv = createCanvas(PIXEL_SIZE * ROOM_SIZE, PIXEL_SIZE * ROOM_SIZE);
    centerCanvas();
    background("#000000");
    ellipseMode(RADIUS);

    room = new room_generator(max_iters, ROOM_SIZE, basic_tile_enum, PIXEL_SIZE);

    room.generate_dungeon_random();
    room.generate_room();

    room_grid = room.grid;
    player_pos = findPos(-1);
    end_pos = findPos(-2);
    // console.log(player_pos);
    // console.log(end_pos);

    frameRate(5);
}

function draw() {
    queueInputs();
    check_input_direction();
    room.render_room(basic_tile_scheme);
    // drawGradient(player_pos[0] * PIXEL_SIZE + PIXEL_SIZE / 2, player_pos[1] * PIXEL_SIZE + PIXEL_SIZE / 2);
    stroke("white");
    strokeWeight(5);
    noFill();
    square(0, 0, PIXEL_SIZE * ROOM_SIZE);
}

// Generates a new level when the mouse is clicked
function mousePressed() {
    generate_new_level();
}

// Finds position of a given value in 2d grid array
function findPos(value) {
    // Check every column
    for (let i = 0; i < room.grid.length; i++) {
        // Check every row
        for (let j = 0; j < room.grid.length; j++) {
            if (room.grid[i][j] == value) {
                return [i, j]; // Returns [column, row] of the wanted value
            }
        }
    }
}

// Stores directional inputs in a buffer that is 3 inputs long
function queueInputs() {
    // Up direction
    if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
        key_buffer = key_buffer.slice(-3).concat("UP");
    }
    // Down direction
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
        key_buffer = key_buffer.slice(-3).concat("DOWN");
    }
    // Left direction
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
        key_buffer = key_buffer.slice(-3).concat("LEFT");
    }
    // Right direction
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
        key_buffer = key_buffer.slice(-3).concat("RIGHT");
    }
}

// Determines what direction player is moving and updates the player grid
// Movement is only allowed if the player is moving to a floor or exit space
function check_input_direction() {
    while (key_buffer.length > 0) {
        let current_key = key_buffer.shift();
        // Up direction
        if (current_key == "UP" && player_pos[1] > 0 && [1, -2].includes(room.grid[player_pos[0]][player_pos[1] - 1])) {
            // If moving to exit, a new level is generated
            if (room.grid[player_pos[0]][player_pos[1] - 1] == -2) {
                return generate_new_level();
            }
            room.update_grid(player_pos[0], player_pos[1], "row", -1);
            player_pos = [player_pos[0], player_pos[1] - 1];
        }
        // Down direction
        else if (
            current_key == "DOWN" &&
            player_pos[1] < room.grid.length &&
            [1, -2].includes(room.grid[player_pos[0]][player_pos[1] + 1])
        ) {
            // If moving to exit, a new level is generated
            if (room.grid[player_pos[0]][player_pos[1] + 1] == -2) {
                return generate_new_level();
            }
            room.update_grid(player_pos[0], player_pos[1], "row", 1);
            player_pos = [player_pos[0], player_pos[1] + 1];
        }
        // Left direction
        else if (
            current_key == "LEFT" &&
            player_pos[0] < room.grid.length &&
            [1, -2].includes(room.grid[player_pos[0] - 1][player_pos[1]])
        ) {
            // If moving to exit, a new level is generated
            if (room.grid[player_pos[0] - 1][player_pos[1]] == -2) {
                return generate_new_level();
            }
            room.update_grid(player_pos[0], player_pos[1], "column", -1);
            player_pos = [player_pos[0] - 1, player_pos[1]];
        }
        // Right direction
        else if (
            current_key == "RIGHT" &&
            player_pos[0] < room.grid.length &&
            [1, -2].includes(room.grid[player_pos[0] + 1][player_pos[1]])
        ) {
            // If moving to exit, a new level is generated
            if (room.grid[player_pos[0] + 1][player_pos[1]] == -2) {
                return generate_new_level();
            }
            room.update_grid(player_pos[0], player_pos[1], "column", 1);
            player_pos = [player_pos[0] + 1, player_pos[1]];
        }
    }
}

// Generates a new level and saves the player and exit locations
function generate_new_level() {
    room.generate_dungeon_random();
    room.generate_room();
    player_pos = findPos(-1);
    end_pos = findPos(-2);
}

//
function drawGradient(y, x) {
    let radius = 50;
    noStroke();
    for (let r = radius; r > 0; --r) {
        fill(0, 0, 0, 0);
        ellipse(y, x, r, r);
    }
}
