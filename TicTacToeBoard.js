// the cells of the board are represented as an array. Code checks for winning arrays. 
class Board {
  constructor() {
    this._rows = 3;
    this._cols = 3;
    this._spaces = this._rows * this._cols;
    
    this.grid = Array(this._spaces).fill(null);
    this.turns = 0;
    this.wins = [];
    this.p1 = null;
    this.p2 = null;
    this.currPlayer = null;
  }

  init(p1sym) {
    // Initialize the game state
    this.turns = 0;
    this.wins = [];
    this.grid.fill(null);
    [this.p1, this.p2] = p1sym === 'o' ? ['o', 'x'] : ['x', 'o'];
    this.currPlayer = this.p1;
  }

  getCurrentPlayer() {
    return this.currPlayer;
  }

  makeMove(index) {
    if (this.p1 === null || this.p2 === null) {
      console.error("init() not called yet");
      return false;
    }
    if (this.isFull() || this.hasWinner()) {
      console.error("game over, call init() again");
      return false;
    }
    if (index < 0 || index >= this._spaces) {
      console.error("index should be a number between 0 and 8 (inclusive)");
      return false;
    }
    if (this.grid[index] !== null) {
      console.error("grid is already occupied");
      return false;
    }
    this.grid[index] = this.currPlayer;
    this.updateWinner();
    this.turns++;
    this.currPlayer = (this.currPlayer === this.p1) ? this.p2 : this.p1;
    return true;
  }

  getGrid() {
    return [...this.grid]; // Return a copy of the grid
  }

  isFull() {
    return this.turns >= this._spaces;
  }

  getWinner() {
    return this.wins;
  }

  getP1Symbol() {
    return this.p1;
  }

  // Private Methods

  updateWinner() {
    const rowWin = this.getFullRows();
    if (rowWin) this.wins.push(rowWin);

    const colWin = this.getFullCols();
    if (colWin) this.wins.push(colWin);

    const diagWin = this.getFullDiagonals();
    if (diagWin) this.wins.push(diagWin);
  }

  hasWinner() {
    return this.wins.length > 0;
  }

  getFullRows() {
    for (let i = 0; i < this._rows; i++) {
      const i1 = i * this._cols;
      const i2 = i1 + 1;
      const i3 = i1 + 2;
      if (this.grid[i1] !== null && this.grid[i1] === this.grid[i2] && this.grid[i2] === this.grid[i3]) {
        return [this.grid[i1], i1, i2, i3];
      }
    }
    return null;
  }

  getFullCols() {
    for (let i = 0; i < this._cols; i++) {
      const i1 = i;
      const i2 = i + this._cols;
      const i3 = i + 2 * this._cols;
      if (this.grid[i1] !== null && this.grid[i1] === this.grid[i2] && this.grid[i2] === this.grid[i3]) {
        return [this.grid[i1], i1, i2, i3];
      }
    }
    return null;
  }

  getFullDiagonals() {
    // Top-left to bottom-right
    const diag1 = [0, this._cols + 1, 2 * this._cols + 2];
    if (this.grid[diag1[0]] !== null && this.grid[diag1[0]] === this.grid[diag1[1]] && this.grid[diag1[1]] === this.grid[diag1[2]]) {
      return [this.grid[diag1[0]], ...diag1];
    }

    // Top-right to bottom-left
    const diag2 = [this._cols - 1, 2 * this._cols - 2, 3 * this._cols - 3];
    if (this.grid[diag2[0]] !== null && this.grid[diag2[0]] === this.grid[diag2[1]] && this.grid[diag2[1]] === this.grid[diag2[2]]) {
      return [this.grid[diag2[0]], ...diag2];
    }

    return null;
  }
}
