// Chris Martens
// Ported from .pde version, 2022-02-15

// Constants
//const PIXEL_SIZE = 24;
const FLOOR_COLOR = "#000000";// white
const ROCK_COLOR = "#ffffff"; // black
const WALL_COLOR = "#858585";  // med/dark grey

const FLOOR = 0, ROCK = 1, WALL = 2;
//const START = -1, END = -2;

class room_generator {
  constructor(max_iters, size) {
    this.grid = []; // 2D grid of the room
    this.max_iters = max_iters; // The max number of iterations
    this.num_iters= 0; // The current number of iterations
    this.cols = size; // X
    this.rows = size; // Y
    this.T1 = 5; // If neighbhor value is >= T1
    this.T2 = 4; // If neighbhor value is < T2
    this.p_size = 24;

    //generate_dungeon_random(); // randomizes the room
  }

  // Takes the random layout and iterate on the cells
  generate_room() {
    while (this.num_iters < this.max_iters) {
      room.iterate_cells(room.update_cell);
    }
    if (this.num_iters == this.max_iters) {
      room.iterate_cells(room.update_wall);
    }
  } 
  
  // Generates the first iteration of a room layout
  generate_dungeon_random() {
    this.grid = [];
    this.num_iters = 0;
    for (let i = 0; i < this.rows; i++) {
      this.grid.push([]);
      for (let j = 0; j < this.cols; j++) {
        if (random(1) <= 0.5) { // Flips a coin to determine tiletype
          this.grid[i].push(ROCK);
        }
        else {
          this.grid[i].push(FLOOR);
        }
      }
    }
  }

  iterate_cells (update_func) {
    let next_grid = [];
    for (let i = 0; i < this.rows; i++) {
      next_grid.push([]);
      for (let j = 0; j < this.cols; j++) {
        next_grid[i].push(update_func(i,j));
      }
    }
    this.num_iters++;
    this.grid = next_grid;
  }

  // Returns the new value that should go in the cell
  update_cell(i,j) {
    let nbr_value = room.get_nbr_value(i,j);
  
    // Turn to rock in nbr_value >= T1
    if (nbr_value >= room.T1) {
      return ROCK;
    }
  
    // Turn to floor if < T2
    if (nbr_value < room.T2) {
      return FLOOR;
    }
  
    // Otherwise, remain the same
    return room.grid[i][j];
  }

  update_wall(i, j) {
    let nbr_value = room.get_nbr_value(i,j);
    
    // turn to wall if neighborvalue between 1 and 7
    if (room.grid[i][j] == 1 && nbr_value > 1 && nbr_value < 7) {
      return WALL;
    }
    
    // Otherwise, remain the same
    return room.grid[i][j];
  }
  
  

  // Returns the negibhor value of a room tile 
  get_nbr_value(i, j) {
    let nbr_value = 0;
    if (i - 1 >= 0) {
      nbr_value += min(1, this.grid[i-1][j]);
    }
    if (j - 1 >= 0) {
      nbr_value += min(1, this.grid[i][j-1]);
    }
    if (i + 1 < this.rows) {
      nbr_value += min(1, this.grid[i+1][j]);
    }
    if (j + 1 < this.cols) {
      nbr_value += min(1, this.grid[i][j+1]);
    }
    if (i - 1 >= 0 && j - 1 >= 0) {
      nbr_value += min(1, this.grid[i-1][j-1]);
    }
    if (i - 1 >= 0 && j + 1 < this.cols) {
      nbr_value += min(1, this.grid[i-1][j+1]);
    }
    if (i + 1 < this.rows && j - 1 >= 0) {
      nbr_value += min(1, this.grid[i+1][j-1]);
    }
    if (i + 1 < this.rows && j + 1 < this.cols) {
      nbr_value += min(1, this.grid[i+1][j+1]);
    }
    return nbr_value;
  }

  //Renders the grid to the canvas
  render_room() {
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLS; j++) {
        if (this.grid[i][j] == FLOOR) {
          fill(FLOOR_COLOR);
          stroke(FLOOR_COLOR);
          rect(i * this.p_size, j * this.p_size, this.p_size, this.p_size);
        }
        else if (this.grid[i][j] == ROCK) {
          fill(ROCK_COLOR);
          stroke(ROCK_COLOR);
          rect(i * this.p_size, j * this.p_size, this.p_size, this.p_size);
        }
        else if (this.grid[i][j] == WALL) {
          fill(WALL_COLOR);
          stroke(WALL_COLOR);
          rect(i * this.p_size, j * this.p_size, this.p_size, this.p_size);
        }
      }
    }
  }
}