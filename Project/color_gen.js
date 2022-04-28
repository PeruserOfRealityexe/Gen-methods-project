/**
 * This function, given a room type generates an array of colors for use in rendering our room.
 * 
 * @author Shreyash Mohatta
 * @param {char} type A single char that represents a room type
 * @returns An array of colors representing a 
 */
function genPalette(type){

    const levels = {
        'n' : color("#ffffff"), //normal room
        'b' : color("#fff2d5"), //beach room
        'f' : color("#669c35"), //forest room
        'v' : color("#cf1020"), //volcano
        'c' : color("#7b5847"), //cave
        's' : color("#041b1e"), //space
        'r' : color(random(360), random(100), random(30,100)), //space
    }
    const baseColor = levels[type] || color(15, 95, 60);

    const shades = [];
    for(let i=0; i<5; i++){
        shades.push(color(hue(baseColor), saturation(baseColor), map(i, 0, 4, brightness(baseColor), 0)));
    }
    shades.push(color((hue(baseColor) + 180) % 360, saturation(baseColor), brightness(baseColor)));

    return shades;
}