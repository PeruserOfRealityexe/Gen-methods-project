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

    room_grid = room.grid;
    console.log(room_grid);

    frameRate(5);
}

function draw() {
    room.render_room(basic_tile_scheme);
    stroke("white");
    strokeWeight(5);
    noFill();
    square(0, 0, PIXEL_SIZE * ROOM_SIZE);
}

function mousePressed() {
    room.generate_dungeon_random();
    room.generate_room();
}
