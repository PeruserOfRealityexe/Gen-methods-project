









// Chris Martens
// Ported from .pde version, 2022-02-15

// Constants
const PIXEL_SIZE = 24;
//const ROCK = 0, FLOOR = 1, WALL = 2, ITEM = 3; //added item
//const START = -1, END = -2;
const COLS = 20, ROWS = 20;
const ROOM_SIZE = 20;

// CA rule parameters
//const T1 = 5, T2 = 4;

// Global variables
let max_iters = 5;
let room;

const basic_tile_enum = Object.freeze({
  rock: 0,
  floor: 1,
  wall: 2 ,
  start: -1,
  end: -2
});

const basic_tile_scheme = Object.freeze({
  floor_color: "#ffffff", // black - can
  rock_color: "#000000", // white - can travel 1
  wall_color: "#858585" // med/dark grey
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
  cnv = createCanvas(PIXEL_SIZE*COLS, PIXEL_SIZE*ROWS);
  centerCanvas();
  background("#000000");

  room = new room_generator(max_iters,ROOM_SIZE,basic_tile_enum);
  
  room.generate_dungeon_random();
  room.generate_room();

  frameRate(5);
}

function draw() {
  room.render_room(basic_tile_scheme);
}

function mousePressed () {
  room.generate_dungeon_random();
  room.generate_room();
}