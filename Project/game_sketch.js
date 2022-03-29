
/**
var cnv;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function setup() {
  cnv = createCanvas(400, 400);
  centerCanvas();
  background(255, 0, 200);
  //let bubble = new room_generator();

  /**
   *   createCanvas(PIXEL_SIZE*COLS, PIXEL_SIZE*ROWS);
  background("#ffffff");
  generate_dungeon_random();
  frameRate(5); //add
   
}

function windowResized() {
  centerCanvas();
}

function draw() {
  background(0);
  ellipse(50,50,80,80);
}
*/

// Chris Martens
// Ported from .pde version, 2022-02-15

// Constants
const PIXEL_SIZE = 24;
//const FLOOR_COLOR = "#858585"; // med/dark grey
//const ROCK_COLOR = "#f0f0e6"; // pale yellow-grey
//const WALL_COLOR = "#b53f00";  // rust red
//const ITEM_COLOR = "#0096FF"; //BRIGHT BLUE

//const ROCK = 0, FLOOR = 1, WALL = 2, ITEM = 3; //added item
//const START = -1, END = -2;
const COLS = 20, ROWS = 20;
const ROOM_SIZE = 20;

// CA rule parameters
//const T1 = 5, T2 = 4;

// Global variables
let max_iters = 5;
//let num_iters = 0;
//let walls_added = false;
//let grid = [];

//---
//---
let room;
//room = new room_generator(max_iters,ROOM_SIZE);

function setup() {
  createCanvas(PIXEL_SIZE*COLS, PIXEL_SIZE*ROWS);
  background("#00ff00");
  room = new room_generator(max_iters,ROOM_SIZE);
  //console.log(room);
  room.generate_dungeon_random();
  room.generate_room();
  //console.log(room);

  //generate_dungeon_random();
  frameRate(5); //add
}

function draw() {
  room.render_room();
  //console.log(room);
  //render_room(room);
  //render_grid();
  //if (num_iters < max_iters) {
  //  iterate_cells(update_cell);
  //} else {
  //  iterate_cells(update_wall);
    //gen_doors();
  //}
}


function mousePressed () {
  room.generate_dungeon_random();
  room.generate_room();
  //room.generate_dungeon_random();
}