/**
 * p5 & p5-sound
 * @link https://p5js.org/
 * @author Lauren Lee McCarthy, Qianqian Ye, Evelyn Masso, community collaborators, Processing Foundation, and NYU ITP
 * @license GNU_version_2.1
 * @license Creative_Commons
 * 
 * p5 provides framework for rendering objects in a scene, among others
 * p5-sound provides framework for using sound in p5
 * 
 * Our group made no changes to either library
 */

// Constants
const PIXEL_SIZE = 24; // The size of our "pixel" square in pixels
const ROOM_SIZE = 20; // The size of the room to render (ROOM_SIZE x ROOM_SIZE)
const FRAME_RATE = 10; // The framerate of the sketch -> higher=faster movement
const basic_tile_enum = Object.freeze({ // Enum that stores the possible tile types for a room
    rock: 0,
    floor: 1,
    wall: 2,
    player: -1,
    end: -2,
});

// Global variables
let level = 1; // Current level the player is on
let difficulty_level = 1; // Current visibility difficulty level
let max_iters = 5; // The max nuber of iterations for the Celluar Automata methods
let room_num = 0; // Number of rooms generated
let room; // Variable storage for the current room
let room_grid; // Variable storage for the 2D grid of the current room
let player_pos, end_pos; // Variable storage for the current position of the player and exit
let key_buffer = []; // Storage key inputs for processing (kinda N-keyish)
let start_visibility = 150; // Radius in pixels of edge of complete visibility
let end_visibility = 300; // Radius in pixels of edge of visibility
let visibility_increment = 8; // Number of levels to change visibility ranges
let max_difficulty_level = 5; // Number of levels where visibility will no longer change
let mchain; // Variable storage for the created Markov Chain
let sound; // Variable storage for p5-sound instance
let basic_tile_scheme = { // base color palette for rendering the room
    floor_color: "#ffffff", // black
    rock_color: "#000000", // white
    wall_color: "#858585", // med/dark grey
    player_color: "green",
    end_color: "red",
};

var cnv; // Stores the canvas instance

// Centers the canvas in the window
function centerCanvas() {
    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    cnv.position(x, y);
}

// When the window is resized, recenter the canvas
function windowResized() {
    centerCanvas();
}

// p5 setup function 
function setup() {
    sound = loadSound("audio/suspense-loop-3.wav"); // Load soundtrack
    cnv = createCanvas(PIXEL_SIZE * ROOM_SIZE + 100, PIXEL_SIZE * ROOM_SIZE);
    centerCanvas();
    background("#000000");
    ellipseMode(RADIUS);
    colorMode(HSB,360,100,100);

    room = new room_generator(max_iters, ROOM_SIZE, basic_tile_enum, PIXEL_SIZE); // Create new room generator
    mchain = new markovGen(50); // Create new Markov chain

    generate_new_level();
    room_grid = room.grid; // Assigns the grid created by the generator to room_grid

    frameRate(FRAME_RATE); // Set the framerate of the sketch
}

// p5 draw function
function draw() {
    queueInputs(); // Queue user inputs
    check_input_direction(); // Determine where the user is moving in the room
    room.render_room(basic_tile_scheme); // Render the room
    drawVisibility(player_pos[0] * PIXEL_SIZE + PIXEL_SIZE / 2, player_pos[1] * PIXEL_SIZE + PIXEL_SIZE / 2); // Culls room visbaility

    // Write out text sidebar
    stroke("white");
    strokeWeight(5);
    noFill();
    square(0, 0, PIXEL_SIZE * ROOM_SIZE);
    rect(0, 0, width, height);
    noStroke();
    fill("white");
    text("Level: " + level.toString(), PIXEL_SIZE * ROOM_SIZE + 20, 30);
    text("Difficulty: " + difficulty_level.toString(), PIXEL_SIZE * ROOM_SIZE + 20, 50);
}

// When a key is pressed, start the music
function keyPressed() {
    if (!sound.isPlaying()) {
        sound.play();
        sound.loop();
    }
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
                return generate_new_level(true);
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
                return generate_new_level(true);
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
                return generate_new_level(true);
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
                return generate_new_level(true);
            }
            room.update_grid(player_pos[0], player_pos[1], "column", 1);
            player_pos = [player_pos[0] + 1, player_pos[1]];
        }
    }
}

// Generates a new level and saves the player and exit locations
function generate_new_level(level_increment) {
    // If the level number is increasing, the level is increased and visibility is adjusted on a set interval
    if (level_increment) {
        level = level + 1;
        if (level % visibility_increment == 0 && difficulty_level < max_difficulty_level) {
            changeVisibilityRange();
            difficulty_level++;
        }
    }

    // Generates a new room
    room.generate_dungeon_random(0.99 - room_num * 0.01 < 0.5 ? 0.5 : 0.99 - room_num * 0.01); // if < 0.5 set to 0.5
    room_num = room_num + 2.25;
    room.generate_room();
    // Find player and exit locations
    player_pos = findPos(-1);
    end_pos = findPos(-2);
    // Update the markov chain and color palette
    let c = mchain.markovState();
    let shades = genPalette(c);
    basic_tile_scheme["floor_color"] = shades[0];
    basic_tile_scheme["wall_color"] = shades[2];
    basic_tile_scheme["rock_color"] = shades[4];
}

// Adjusts the visibility ranges as the difficulty increases
function changeVisibilityRange() {
    start_visibility = start_visibility * 0.75;
    end_visibility = end_visibility * 0.75;
}

// Draws the radial visibility based off the start and end visibility radii
function drawVisibility(y, x) {
    let alpha = 1;
    let fill_color = color(0, 0, 0, alpha);
    noFill();
    for (let r = 0; r <= width * 1.5; r++) {
        if (r < start_visibility) {
            alpha = 0;
        } else if (r >= start_visibility && r <= end_visibility) {
            alpha = ((r + 1 - start_visibility) / (end_visibility - start_visibility));
        } else {
            alpha = 1;
        }
        fill_color = color(0, 0, 0, alpha);
        stroke(fill_color);
        ellipse(y, x, r, r);
    }
}
