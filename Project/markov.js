/**
 * Source: https://editor.p5js.org/codingtrain/sketches/Y6SvoMcyH
 * Author: codingtrain
 * License: Creative Commons -> GNU version 2.1
 * The inital code prodived functionality to output randomized text via Markov Chain.
 * We adapted the code by:
 * - Adding a puesudorandom text input
 * - shifting the output to chars
*/
class markovGen {
    constructor(size){
        this.txt = this.txtGen(size); // Generates the input text
        this.order = 1;
        this.ngrams = {};
        this.currentGram = this.txt.substring(0, this.order);

        for (var i = 0; i <= this.txt.length - this.order; i++) {
            var gram = this.txt.substring(i, i + this.order);
        
            if (!this.ngrams[gram]) {
              this.ngrams[gram] = [];
            }
            this.ngrams[gram].push(this.txt.charAt(i + this.order));
        }
    }

    txtGen(length) {
        var newTxt = '';
        for (let i = 0; i < length; i++){
          let randNum = random();
          if (randNum < 0.142) {
            newTxt += 'n'; //normal room 
          } else if(randNum < 2 * 0.142) {
            newTxt += 'b'; //beach room
          } else if(randNum < 3 * 0.142) {
            newTxt += 'f'; //forest room
          } else if(randNum < 4 * 0.142) {
            newTxt += 'v'; //hell/volcano - can be changed
          } else if(randNum < 5 * 0.142) {
            newTxt += 'c'; //cave - can be changed
          } else if(randNum < 6 * 0.142) {
            newTxt += 's'; //space - can be changed
          } else {
            newTxt += 'r'; //random palette
          }
        }
        return newTxt;
    }
    markovState() {      
        while(true){
            var possibilities = this.ngrams[this.currentGram];
            if (possibilities) {
                var next = random(possibilities);
                if(next){
                    this.currentGram = next;
                    break;
                }
            }
        }
        return next;
    }
}