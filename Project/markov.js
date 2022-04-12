class markovGen {
    constructor(size){
        this.txt = this.txtGen(size);
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
                this.currentGram = next;
                break;
            }
        }
        return next;
    }
}