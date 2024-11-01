class Game {
  constructor(animateMove, animateWin, displayMessage, pauseAnimation) {
    this.board = new Board();
    this.animateMove = animateMove;
    this.animateWin = animateWin;
    this.displayMessage = displayMessage;
    this.pauseAnimation = pauseAnimation;

    this.isWaiting = true;
    this.isSinglePlayer = false;
    this.computerPlayer = new ComputerPlayerLogic();
  }

  init(isSinglePlayer, player1Symbol) {
    this.board.init(player1Symbol);
    this.isSinglePlayer = isSinglePlayer;
    if (isSinglePlayer) {
      this.computerPlayer.init();
    }
    this.isWaiting = true;
  }

  makeMove(index) {
    index = parseInt(index);
    if (this.isWaiting) {
      this.isWaiting = false;
      if (!this._makeMove(index)) {
        this.isWaiting = true;
        return false;

      }

      if (this.isSinglePlayer) {
        const winner = this.board.getWinner();
        if (winner.length <= 0 && !this.board.isFull()) {
          this.pauseAnimation(() => {
            const nextMove = this.computerPlayer.getNextMove(index);
            this._makeMove(nextMove, true);
            this.isWaiting = true;
          });
        }
      } else {
        this.isWaiting = true;
      }
    }
  }

  getGrid() {
    return this.board.getGrid();
  }

  getCurrentPlayerSymbol() {
    return this.board.getCurrentPlayer();
  }

  _makeMove(index, byComputer = false) {
    const currentPlayer = this.board.getCurrentPlayer();
    const valid = this.board.makeMove(index);
    if (!valid) {
      return false;
    } else {
      this.animateMove(currentPlayer, index);
    }
        
        // returns false for invalid move
        // don't continue if invalid

    const winner = this.board.getWinner();
    if (winner.length > 0) {
      for (const winCombo of winner) {
        this.animateWin(winCombo.slice(1));
      }
      const name = byComputer
        ? "Computer"
        : (winner[0][0] === this.board.getPlayer1Symbol() ? "Player 1" : "Player 2");
        //if winning move is made by computer, name = Computer. If not, gets the winners symvol from the winning aray and checks if its Player1's symbol. If its not, then name = Player 2, if not, name = Player 1
      const message = `${name} won!`;
      this.displayMessage(message);
    } else if (this.board.isFull()) {
      this.displayMessage("It's a tie!");
    }
    return true;
  }
}


