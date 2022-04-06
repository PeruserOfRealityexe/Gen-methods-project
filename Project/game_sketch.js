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

    room = new room_generator(max_iters, ROOM_SIZE, basic_tile_enum, PIXEL_SIZE);

    room.generate_dungeon_random();
    room.generate_room();
    //console.log(room.getRegions()); //Added

    room_grid = room.grid;
    player_pos = findPos(-1);
    end_pos = findPos(-2);
    // console.log(player_pos);
    // console.log(end_pos);

    frameRate(10);
}

function draw() {
    check_input_direction();
    room.render_room(basic_tile_scheme);
    stroke("white");
    strokeWeight(5);
    noFill();
    square(0, 0, PIXEL_SIZE * ROOM_SIZE);
}

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

// Determines what direction player is moving and updates the player grid
function check_input_direction() {
    // Up direction
    if ((keyIsDown(87) || keyIsDown(UP_ARROW)) && player_pos[1] > 0 && room.grid[player_pos[0]][player_pos[1] - 1] != 2) {
        // If moving to exit, a new level is generated
        if (room.grid[player_pos[0]][player_pos[1] - 1] == -2) {
            return generate_new_level();
        }
        room.update_grid(player_pos[0], player_pos[1], "row", -1);
        player_pos = [player_pos[0], player_pos[1] - 1];
    }
    // Down direction
    else if (
        (keyIsDown(83) || keyIsDown(DOWN_ARROW)) &&
        player_pos[1] < room.grid.length &&
        room.grid[player_pos[0]][player_pos[1] + 1] != 2
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
        (keyIsDown(65) || keyIsDown(LEFT_ARROW)) &&
        player_pos[0] < room.grid.length &&
        room.grid[player_pos[0] - 1][player_pos[1]] != 2
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
        (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) &&
        player_pos[0] < room.grid.length &&
        room.grid[player_pos[0] + 1][player_pos[1]] != 2
    ) {
        // If moving to exit, a new level is generated
        if (room.grid[player_pos[0] + 1][player_pos[1]] == -2) {
            return generate_new_level();
        }
        room.update_grid(player_pos[0], player_pos[1], "column", 1);
        player_pos = [player_pos[0] + 1, player_pos[1]];
    }
}

// Generates a new level and saves the player and exit locations
function generate_new_level() {
    room.generate_dungeon_random();
    room.generate_room();
    player_pos = findPos(-1);
    end_pos = findPos(-2);
}
