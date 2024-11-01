class Board {
  constructor() {
    this.rows = 3;
    this.cols = 3;
    this.totalSpaces = this.rows * this.cols;
    
    this.grid = Array(this.totalSpaces).fill(null);
    this.turnCount = 0;
    this.winCombinations = [];
    this.player1Symbol = null;
    this.player2Symbol = null;
    this.currentPlayer = null;
  }

  init(player1Symbol) {
    this.turnCount = 0;
    this.winCombinations = [];
    this.grid.fill(null);
    [this.player1Symbol, this.player2Symbol] = player1Symbol === 'o' ? ['o', 'x'] : ['x', 'o'];
    this.currentPlayer = this.player1Symbol;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  makeMove(index) {
    if (!this.player1Symbol || !this.player2Symbol) {
      throw new Error("init() not called yet");
    }
    if (this.isFull() || this.hasWinner()) {
      throw new Error("Game over, call init() again");
    }
    if (index < 0 || index >= this.totalSpaces) {
      throw new Error("Index should be a number between 0 and 8 (inclusive)");
    }
    if (this.grid[index] !== null) {
      throw new Error("Cell is already occupied");
    }
    this.grid[index] = this.currentPlayer;
    this.updateWinner();
    this.turnCount++;
    this.currentPlayer = (this.currentPlayer === this.player1Symbol) ? this.player2Symbol : this.player1Symbol;
    return true;
  }

  getGrid() {
    return [...this.grid];
  }

  isFull() {
    return this.turnCount >= this.totalSpaces;
  }

  getWinner() {
    return this.winCombinations;
  }

  getPlayer1Symbol() {
    return this.player1Symbol;
  }

  updateWinner() {
    const rowWin = this.checkRows();
    if (rowWin) this.winCombinations.push(rowWin);

    const colWin = this.checkCols();
    if (colWin) this.winCombinations.push(colWin);

    const diagWin = this.checkDiagonals();
    if (diagWin) this.winCombinations.push(diagWin);
  }

  hasWinner() {
    return this.winCombinations.length > 0;
  }

  checkRows() {
    for (let i = 0; i < this.rows; i++) {
      const start = i * this.cols;
      if (this.grid[start] !== null && this.grid[start] === this.grid[start + 1] && this.grid[start + 1] === this.grid[start + 2]) {
        return [this.grid[start], start, start + 1, start + 2];
      }
    }
    return null;
  }

  checkCols() {
    for (let i = 0; i < this.cols; i++) {
      if (this.grid[i] !== null && this.grid[i] === this.grid[i + this.cols] && this.grid[i + this.cols] === this.grid[i + 2 * this.cols]) {
        return [this.grid[i], i, i + this.cols, i + 2 * this.cols];
      }
    }
    return null;
  }

  checkDiagonals() {
    const diag1 = [0, this.cols + 1, 2 * this.cols + 2];
    if (this.grid[diag1[0]] !== null && this.grid[diag1[0]] === this.grid[diag1[1]] && this.grid[diag1[1]] === this.grid[diag1[2]]) {
      return [this.grid[diag1[0]], ...diag1];
    }

    const diag2 = [this.cols - 1, 2 * this.cols - 2, 3 * this.cols - 3];
    if (this.grid[diag2[0]] !== null && this.grid[diag2[0]] === this.grid[diag2[1]] && this.grid[diag2[1]] === this.grid[diag2[2]]) {
      return [this.grid[diag2[0]], ...diag2];
    }

    return null;
  }
}

