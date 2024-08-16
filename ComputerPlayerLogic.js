class ComputerPlayerLogic {
  constructor() {
    this.WINNING_COMBOS = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    this.CORNERS = [0, 2, 6, 8];
    this.EDGES = [1, 3, 5, 7];
    this.OPPOSITES = [8, 7, 6, 5, 4, 3, 2, 1, 0];
    this.CORNER_OPPOSITE_EDGES = {
      0: [5, 7],
      2: [3, 7],
      6: [1, 5],
      8: [1, 3],
    };
    this.EDGE_ADJACENT_EDGES = {
      1: [3, 5],
      3: [1, 7],
      5: [1, 7],
      7: [3, 5],
    };
    this.EDGE_OPPOSITE_CORNERS = {
      1: [6, 8],
      3: [2, 8],
      5: [0, 6],
      7: [0, 2],
    };
    this.EDGE_ADJACENT_CORNERS = {
      1: [0, 2],
      3: [0, 6],
      5: [2, 8],
      7: [6, 8],
    };
    this.EDGE_ADJACENT_OPPOSITE_EDGE = {
      1: { 6: 5, 8: 3 },
      3: { 2: 7, 8: 1 },
      5: { 0: 7, 6: 1 },
      7: { 0: 5, 2: 3 },
    };

    this.init();
  }

  init() {
    this.grid = Array(9).fill(null);
    this.firstMove = null;
    this.secondMove = null;
    this.thirdMove = null;
    this.center_oppositeCorner = null;
    this.corner_oppositeEdges = null;
    this.corner_oppositeCorner = null;
    this.edge_oppositeEdge = null;
    this.edge_adjacentEdges = null;
    this.edge_oppositeCorners = null;
  }

  getNextMove(p1Move) {
    this.grid[p1Move] = 1;
    let nextMove;

    if (this.firstMove === null) {
      this.firstMove = p1Move;
      this.secondMove = this.getSecondMove();
      nextMove = this.secondMove;
    } else if (this.thirdMove === null) {
      this.thirdMove = p1Move;
      nextMove = this.getFourthMove();
    } else {
      nextMove = this.blockOrRandom();
    }

    this.grid[nextMove] = 2;
    return nextMove;
  }

  getSecondMove() {
    if (this.firstMove === 4) {
      const secondMove = this.chooseOneAvailable(this.CORNERS);
      this.center_oppositeCorner = this.OPPOSITES[secondMove];
      return secondMove;
    } else if (this.CORNERS.includes(this.firstMove)) {
      this.corner_oppositeEdges = this.CORNER_OPPOSITE_EDGES[this.firstMove];
      this.corner_oppositeCorner = this.OPPOSITES[this.firstMove];
    } else {
      this.edge_adjacentEdges = this.EDGE_ADJACENT_EDGES;
      this.edge_oppositeCorners = this.EDGE_OPPOSITE_CORNERS;
      this.edge_oppositeEdge = this.OPPOSITES[this.firstMove];
    }

    return 4; // Return 4 for both corner and edge cases
  }

  getFourthMove() {
    let fourthMove;

    if (this.firstMove === 4 && this.thirdMove === this.center_oppositeCorner) {
      fourthMove = this.chooseOneAvailable(this.CORNERS);
    } else if (this.CORNERS.includes(this.firstMove)) {
      if (this.CORNER_OPPOSITE_EDGES[this.firstMove].includes(this.thirdMove)) {
        fourthMove = this.corner_oppositeCorner;
      } else if (this.thirdMove === this.corner_oppositeCorner) {
        fourthMove = this.chooseOneAvailable(this.EDGES);
      }
    } else if (this.EDGES.includes(this.firstMove)) {
      if (this.thirdMove === this.edge_oppositeEdge) {
        fourthMove = this.chooseOneAvailable(this.CORNERS);
      } else if (this.EDGE_OPPOSITE_CORNERS[this.firstMove].includes(this.thirdMove)) {
        fourthMove = this.EDGE_ADJACENT_OPPOSITE_EDGE[this.firstMove][this.thirdMove];
      } else if (this.edge_adjacentEdges[this.firstMove].includes(this.thirdMove)) {
        fourthMove = this.chooseOneAvailable(this.EDGE_ADJACENT_CORNERS[this.firstMove]);
      }
    }

    return fourthMove ?? this.blockOrRandom();
  }

  getWinningMove(player) {
    for (const combo of this.WINNING_COMBOS) {
      if (this.grid[combo[0]] === player && this.grid[combo[1]] === player && this.grid[combo[2]] === null) {
        return combo[2];
      } else if (this.grid[combo[0]] === player && this.grid[combo[1]] === null && this.grid[combo[2]] === player) {
        return combo[1];
      } else if (this.grid[combo[0]] === null && this.grid[combo[1]] === player && this.grid[combo[2]] === player) {
        return combo[0];
      }
    }
    return null;
  }

  chooseOneAvailable(indices) {
    const emptyIndices = indices.filter(index => this.grid[index] === null);
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  blockOrRandom() {
    let nextMove = this.getWinningMove(2);
    if (nextMove !== null) return nextMove;

    nextMove = this.getWinningMove(1);
    if (nextMove !== null) return nextMove;

    return this.getRandomMove();
  }

  getRandomMove() {
    const emptyIndices = this.grid.map((val, index) => (val === null ? index : null)).filter(index => index !== null);
    return this.chooseOneAvailable(emptyIndices);
  }
}
