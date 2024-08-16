class Game {
  constructor(animateMakeMove, animateWin, displayMessage, pauseAnimation) {
    this.board = new Board();
    this.animateMakeMove = animateMakeMove;
    this.animateWin = animateWin;
    this.displayMessage = displayMessage;
    this.pauseAnimation = pauseAnimation;

    this.waiting = true;
    this.computerPlayOn = false;
    this.computerPlayer = new ComputerPlayerLogic();
  }

  init(isSinglePlayer, p1sym) {
    this.board.init(p1sym);
    this.computerPlayOn = isSinglePlayer;
    if (this.computerPlayOn) {
      this.computerPlayer.init();
    }
    this.waiting = true;
  }

  makeMove(index) {
    index = parseInt(index); //index is the cell of the board
    if (this.waiting) {
      if (this.board.getCurrentPlayer() === undefined) {
        console.error("init() not called yet");
        return false;
      }
      this.waiting = false;
      if (!this._makeMove(index)) {
        // returns false for invalid move
        // don't continue if invalid
        this.waiting = true;
        return false;
      }

      if (this.computerPlayOn) {
        const wins = this.board.getWinner(); 
        if (wins.length <= 0 && !this.board.isFull()) {
          this.pauseAnimation(() => {
            const nextMove = this.computerPlayer. getNextMove(index); //waits for animation, then computer moves
            this._makeMove(nextMove, true);
            this.waiting = true; //ready for players move
          });
        }
      } else {
        this.waiting = true;
      }
    }
  }

  getGrid() {
    return this.board.getGrid();
  }

  currPlayerSymbol() {
    return this.board.getCurrentPlayer(); // if current player is X or O
  }

// Making a move in the game. 

  _makeMove(index, byComputer = false) {
    const currPlayer = this.board.getCurrentPlayer();
    const valid = this.board.makeMove(index);
    if (!valid) {
      return false;
    } else {
      this.animateMakeMove(currPlayer, index);
    }

    const wins = this.board.getWinner();
    if (wins.length > 0) { // there is a winner
      for (const winCombo of wins) {
        // display winning animation
        this.animateWin(winCombo.slice(1)); // flash the three winning squares. winCombo is a winning array
      }
      // display winning message with name as argument
      const name = byComputer
        ? "Computer"
        : (wins[0][0] === this.board.getP1Symbol() ? "Player 1" : "Player 2"); //if winning move is made by computer, name = Computer. If not, gets the winners symvol from the winning aray and checks if its Player1's symbol. If its not, then name = Player 2, if not, name = Player 1
      const message = `${name} won!`;
      this.displayMessage(message);
    } else if (this.board.isFull()) {
      this.displayMessage("It's a tie!");
    }
    return true;
  }
}
