// Chris Martens
// Ported from .pde version, 2022-02-15

// Constants
const PIXEL_SIZE = 10;
const FLOOR_COLOR = "#858585"; // med/dark grey
const ROCK_COLOR = "#f0f0e6"; // pale yellow-grey
const WALL_COLOR = "#b53f00";  // rust red
const ITEM_COLOR = "#0096FF"; //BRIGHT BLUE

const ROCK = 0, FLOOR = 1, WALL = 2, ITEM = 3; //added item
const START = -1, END = -2;
const COLS = 20, ROWS = 20;

// CA rule parameters
const T1 = 5, T2 = 4;

// Global variables
let max_iters = 5;
let num_iters = 0;
let walls_added = false;
let grid = [];

//---
class room_generator {
  constructor(max_iters) {
    this.grid = [];
    this.max_iters = max_iters;
  }
}

//---

function setup() {
  createCanvas(PIXEL_SIZE*COLS, PIXEL_SIZE*ROWS);
  background("#ffffff");
  generate_dungeon_random();
  frameRate(5); //add
}

function draw() {
  render_grid();
  if (num_iters < max_iters) {
    iterate_cells(update_cell);
  } else {
    iterate_cells(update_wall);
    //gen_doors();
  }
}

function render_grid() {
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (grid[i][j] == ROCK) {
        fill(ROCK_COLOR);
        stroke(ROCK_COLOR);
        rect(i * PIXEL_SIZE, j * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
      }
      else if (grid[i][j] == FLOOR) {
        fill(FLOOR_COLOR);
        stroke(FLOOR_COLOR);
        rect(i * PIXEL_SIZE, j * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
      }
      else if (grid[i][j] == WALL) {
        fill(WALL_COLOR);
        stroke(WALL_COLOR);
        rect(i * PIXEL_SIZE, j * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
      }
      else if (grid[i][j] == ITEM) {
        fill(ITEM_COLOR);
        stroke(ITEM_COLOR);
        rect(i * PIXEL_SIZE, j * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
      }
    }
  }
}

function generate_dungeon_random() {
  grid = [];
  num_iters=0;
  for (let i = 0; i < ROWS; i++) {
    grid.push([]);
    for (let j = 0; j < COLS; j++) {
      if (random(1) <= 0.5) {
        grid[i].push(ROCK);
      }
      else {
        grid[i].push(FLOOR);
      }
    }
  }
}

function get_nbr_value(i, j) {
  let nbr_value = 0;
  if (i - 1 >= 0) {
    nbr_value += min(1, grid[i-1][j]);
  }
  if (j - 1 >= 0) {
    nbr_value += min(1, grid[i][j-1]);
  }
  if (i + 1 < ROWS) {
    nbr_value += min(1, grid[i+1][j]);
  }
  if (j + 1 < COLS) {
    nbr_value += min(1, grid[i][j+1]);
  }
  if (i - 1 >= 0 && j - 1 >= 0) {
    nbr_value += min(1, grid[i-1][j-1]);
  }
  if (i - 1 >= 0 && j + 1 < COLS) {
    nbr_value += min(1, grid[i-1][j+1]);
  }
  if (i + 1 < ROWS && j - 1 >= 0) {
    nbr_value += min(1, grid[i+1][j-1]);
  }
  if (i + 1 < ROWS && j + 1 < COLS) {
    nbr_value += min(1, grid[i+1][j+1]);
  }
  return nbr_value;
}

// Returns the new value that should go in the cell
function update_cell(i, j) {
  let nbr_value = get_nbr_value(i,j);
  
  // Turn to rock in nbr_value >= T1
  if (nbr_value >= T1) {
    return FLOOR;
  }
  
  // Turn to floor if < T2
  if (nbr_value < T2) {
    return ROCK;
  }
  
  // Otherwise, remain the same
  return grid[i][j];
}

function update_wall(i, j) {
  let nbr_value = get_nbr_value(i,j);
  
  // turn to wall if neighborvalue between 1 and 7
  if (grid[i][j] == 1 && nbr_value > 1 && nbr_value < 7) {
    return WALL;
  } else {
    
  //if (grid[i][j] == 1 && nbr_value == 7) {
    //return ITEM; //add flood fill check
  //}//5<7
  
  // Otherwise, remain the same
  return grid[i][j];
  }
  //console.log(grid);
}

function iterate_cells(update_func) {  
  let next_grid = [];
  for (let i=0; i < ROWS; i++) {
    next_grid.push([]);
    for (let j=0; j<COLS; j++) {
      next_grid[i].push(update_func(i,j));
    }
  }
  num_iters++;
  grid = next_grid;
  
 // console.log("Updated grid: " + grid);
}

function mousePressed() {
  //iterate_cells();
  console.log(grid);
  //generate_dungeon_random();
}


//-----


//function gen_doors() {
//  let centerX = round((ROWS-1)/2), centerY ;
//  if (grid[round((ROWS-1)/2)][(COLS-1)/2] == 1) { // 1 == floor 
//    grid[(ROWS-1)/2][(COLS-1)/2] == -1;
//  }
//}



function flood_fill() {
  //determine start node by starting in the middle and going in a random dir - look for white floor
  //then depth first to find a longest path and put your exit
}