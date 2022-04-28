/**
 * This class generates the playable rooms via celluar automata
 * 
 * Celluar Automata Code:
 * @link https://editor.p5js.org/chrisamaphone/sketches/lN211pY4w
 * @author Chris Martens
 * @license Fair_Use
 * 
 * Chris Martens Ported from .pde version, 2022-02-15
 * 
 * The original code provided a boilerplate for rendering a 2D grid via Celluar Automata
 * We adapted the code by:
 * - shifting the code into a class
 * - adding the rendering code
 * - Adding code to determine regions of playing space
 */
class room_generator {
    constructor(max_iters, size, tile_types, p_size) {
        this.grid = []; // 2D grid of the room
        this.max_iters = max_iters; // The max number of iterations
        this.num_iters = 0; // The current number of iterations
        this.cols = size; // X
        this.rows = size; // Y
        this.T1 = 5; // If neighbor value is >= T1
        this.T2 = 4; // If neighbor value is < T2
        this.p_size = p_size;
        this.tile_types = tile_types;
    }

    // Takes the random layout and iterate on the cells
    generate_room() {
        // Applys different rulesets based on the iteration
        while (this.num_iters < this.max_iters) {
            this.iterate_cells(this.update_cell);
        }
        if (this.num_iters == this.max_iters) {
            this.iterate_cells(this.update_wall);
        }
        
        let regions = this.getRegions(); // Grabs all traverable regions
        let room_size = 2; // The minimum size that a playable room can be 
        let idx = 0;
        for(let x = 0; x < regions.length; x++) { // Determines the largest regions
            if (regions[x].length >= room_size) {
                idx = x;
                room_size = regions[x].length;
            }
        }
        this.grid[regions[idx][0].x][regions[idx][0].y]=-1;
        this.grid[regions[idx][room_size - 1].x][regions[idx][room_size - 1].y]=-2;
    }

    // Generates the first iteration of a room layout
    generate_dungeon_random(floor_value) {
        this.grid = [];
        this.num_iters = 0;
        for (let i = 0; i < this.rows; i++) {
            this.grid.push([]);
            for (let j = 0; j < this.cols; j++) {
                if (random(1) <= floor_value) {
                    this.grid[i].push(this.tile_types.floor);
                } else {
                    this.grid[i].push(this.tile_types.rock);
                }
            }
        }
    }

    // Iterates the map cells
    iterate_cells(update_func) {
        let next_grid = [];
        for (let i = 0; i < this.rows; i++) {
            next_grid.push([]);
            for (let j = 0; j < this.cols; j++) {
                next_grid[i].push(update_func(this, i, j));
            }
        }
        this.num_iters++;
        this.grid = next_grid;
    }

    // Returns the new value that should go in the cell
    update_cell(gen, i, j) {
        let nbr_value = gen.get_nbr_value(i, j);

        // Turn to rock in nbr_value >= T1
        if (nbr_value >= gen.T1) {
            return gen.tile_types.floor;
        }

        // Turn to floor if < T2
        if (nbr_value < gen.T2) {
            return gen.tile_types.rock;
        }

        // Otherwise, remain the same
        return gen.grid[i][j];
    }

    update_wall(gen, i, j) {
        let nbr_value = gen.get_nbr_value(i, j);

        // turn to wall if neighborvalue between 1 and 7
        if (gen.grid[i][j] == 1 && nbr_value > 1 && nbr_value < 7) {
            return gen.tile_types.wall;
        }

        // Otherwise, remain the same
        return gen.grid[i][j];
    }

    // Returns the negibhor value of a room tile
    get_nbr_value(i, j) {
        let nbr_value = 0;
        if (i - 1 >= 0) {
            nbr_value += min(1, this.grid[i - 1][j]);
        }
        if (j - 1 >= 0) {
            nbr_value += min(1, this.grid[i][j - 1]);
        }
        if (i + 1 < this.rows) {
            nbr_value += min(1, this.grid[i + 1][j]);
        }
        if (j + 1 < this.cols) {
            nbr_value += min(1, this.grid[i][j + 1]);
        }
        if (i - 1 >= 0 && j - 1 >= 0) {
            nbr_value += min(1, this.grid[i - 1][j - 1]);
        }
        if (i - 1 >= 0 && j + 1 < this.cols) {
            nbr_value += min(1, this.grid[i - 1][j + 1]);
        }
        if (i + 1 < this.rows && j - 1 >= 0) {
            nbr_value += min(1, this.grid[i + 1][j - 1]);
        }
        if (i + 1 < this.rows && j + 1 < this.cols) {
            nbr_value += min(1, this.grid[i + 1][j + 1]);
        }
        return nbr_value;
    }

    // Updates grid if player presses a valid direction key
    update_grid(col, row, orientation, direction) {
        this.grid[col][row] = 1;
        if (orientation == "row") {
            this.grid[col][row] = 1;
            this.grid[col][row + direction] = -1;
        } else if (orientation == "column") {
            this.grid[col + direction][row] = -1;
        }
    }

    //Renders the grid to the canvas
    render_room(colorset) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.grid[i][j] == this.tile_types.rock) {
                    fill(colorset.rock_color);
                    stroke(colorset.rock_color);
                    rect(i * this.p_size, j * this.p_size, this.p_size, this.p_size);
                } else if (this.grid[i][j] == this.tile_types.floor) {
                    fill(colorset.floor_color);
                    stroke(colorset.floor_color);
                    rect(i * this.p_size, j * this.p_size, this.p_size, this.p_size);
                } else if (this.grid[i][j] == this.tile_types.wall) {
                    fill(colorset.wall_color);
                    stroke(colorset.wall_color);
                    rect(i * this.p_size, j * this.p_size, this.p_size, this.p_size);
                } else if (this.grid[i][j] == this.tile_types.player) {
                    fill(colorset.player_color);
                    stroke(colorset.player_color);
                    rect(i * this.p_size, j * this.p_size, this.p_size, this.p_size);
                } else if (this.grid[i][j] == this.tile_types.end) {
                    fill(colorset.end_color);
                    stroke(colorset.end_color);
                    rect(i * this.p_size, j * this.p_size, this.p_size, this.p_size);
                }
            }
        }
    }
  
    /**
     * This function evaluates the available regions in a 2D grid
     * @link https://github.com/SebLague/Procedural-Cave-Generation/blob/master/Episode%2005/MapGenerator.cs
     * @link https://www.youtube.com/watch?v=xYOG8kH2tF8
     * @author Sebastian SebLague
     * @license Fair_Use
     * 
     * This code determines the travserible regions in a 2D grid
     * We adapted the code by:
     * - shifting the code to JS
     * 
     * @returns an array of available regions
     */
    getRegions() {
        let tiles_checked = []; // Creates a 2D grid to determine if the location has been checked
        for (let i = 0; i < this.rows; i++) {
            tiles_checked.push([]);
            for (let j = 0; j < this.cols; j++) {
                tiles_checked[i].push(0);
            }
        }

        let regions = []; // Stores all regions
            for (let i=0; i < this.rows; i++) {
                for (let j=0; j < this.cols; j++) {
                    if(this.grid[i][j] == this.tile_types.floor && tiles_checked[i][j] == 0) {
                        let region = []; // Stores the current region
                        let queue = []; // Stores the locations in the room that need to be checked
                        tiles_checked[i][j] = 1;
                        queue.push(createVector(i,j));
                        while (queue.length > 0) {
                            let coords = queue.shift();
                            region.push(coords);
                            for (let x = coords.x - 1; x <= coords.x + 1; x++) {
                                for (let y = coords.y - 1; y <= coords.y + 1; y++) {
                                    if ((x > 0 && x < this.rows && y > 0 && y < this.cols) && (x == coords.x || y == coords.y)) {
                                        // If the tile checked is a floor and hasn't been checked already, add it to the queue
                                        if (tiles_checked[x][y] == 0 && this.grid[x][y] == this.tile_types.floor) {
                                            tiles_checked[x][y] = 1;
                                            queue.push(createVector(x,y));
                                        } 
                                    }
                                }
                            }
                        }
                        regions.push(region);
                    }
                }
            }
        return regions;
    }
}