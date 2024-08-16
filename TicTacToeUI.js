class TicTacToeUI {
  constructor() {
    this.game = null;
    this.isSinglePlayer = null;
    this.p1sym = null;
    
    // Bind methods to ensure proper `this` context
    this.startGame = this.startGame.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.askNumPlayers = this.askNumPlayers.bind(this);
    this.chooseP1Sym = this.chooseP1Sym.bind(this);
    this.displayMessage = this.displayMessage.bind(this);
    this.letsStartOver = this.letsStartOver.bind(this);
    this.animateMakeMove = this.animateMakeMove.bind(this);
    this.pauseAnimation = this.pauseAnimation.bind(this);
    this.animateWin = this.animateWin.bind(this);

    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('reset').style.visibility = 'hidden';

      this.game = new Game(this.animateMakeMove, this.animateWin, this.displayMessage, this.pauseAnimation);

      // Set up the buttons for player count selection
      document.querySelectorAll('.num-players-btn').forEach(button => {
        button.addEventListener('click', () => {
          this.isSinglePlayer = button.getAttribute('value') === '1';
          this.hideElement('num-players');
          this.chooseP1Sym();
        });
      });

      // Set up the buttons for player symbol selection
      document.querySelectorAll('.choose-p1-sym-btn').forEach(button => {
        button.addEventListener('click', () => {
          this.p1sym = button.getAttribute('value');
          this.hideElement('choose-p1-sym');
          this.startGame();
        });
      });

      // Event listener for reset button
      document.getElementById('reset').addEventListener('click', this.resetGame);

      // Initial hide of the grid
      setTimeout(() => {
        this.hideElement('grid');
        this.askNumPlayers();
      }, 400);

      // Set up the grid blocks to listen for clicks
      document.querySelectorAll('.gridblock').forEach(gridblock => {
        gridblock.addEventListener('click', () => {
          const index = parseInt(gridblock.getAttribute('value'), 10);
          this.game.makeMove(index);
        });
      });
    });
  }

  showElement(elementId, duration = 600) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.opacity = 0; // Start as transparent
      element.style.display = 'block';
      const startTime = performance.now();
      const fade = (now) => {
        const elapsed = now - startTime;
        const opacity = Math.min(elapsed / duration, 1);
        element.style.opacity = opacity;
        if (opacity < 1) {
          requestAnimationFrame(fade);
        }
      };
      requestAnimationFrame(fade);
    }
  }

  hideElement(elementId, duration = 600) {
    const element = document.getElementById(elementId);
    if (element) {
      element.style.opacity = 1; // Start as fully visible
      const startTime = performance.now();
      const fade = (now) => {
        const elapsed = now - startTime;
        const opacity = Math.max(1 - elapsed / duration, 0);
        element.style.opacity = opacity;
        if (opacity > 0) {
          requestAnimationFrame(fade);
        } else {
          element.style.display = 'none';
        }
      };
      requestAnimationFrame(fade);
    }
  }

  askNumPlayers() {
    this.showElement('num-players');
  }

  chooseP1Sym() {
    this.showElement('choose-p1-sym');
  }

  animateMakeMove(currPlayer, index) {
    const cell = document.querySelector(`#sq${index} span`);
    if (cell) cell.textContent = currPlayer;
  }

  pauseAnimation(callback) {
    this.showElement('thinking');
    setTimeout(() => {
      this.hideElement('thinking');
      if (callback) callback();
    }, 800); // Adjusted for longer delay
  }

  animateWin(arrCombo) {
    document.getElementById('reset').style.visibility = 'hidden';
    arrCombo.forEach(index => {
      const cell = document.querySelector(`#sq${index} span`);
      if (cell) cell.classList.add('color-win');
    });
  }

  displayMessage(message) {
    document.getElementById('reset').style.visibility = 'hidden';
    const messageElem = document.querySelector('#message');
    if (messageElem) {
      messageElem.textContent = message;
      this.hideElement('grid');
      this.showElement('message');
      setTimeout(() => {
        this.hideElement('message');
        this.letsStartOver();
      }, 1600); // Adjusted for longer delay
    }
  }

  letsStartOver() {
    const messageElem = document.querySelector('#message');
    if (messageElem) {
      messageElem.textContent = "Let's play again!";
      this.showElement('message');
      setTimeout(() => {
        this.hideElement('message');
        this.startGame();
      }, 1200); // Adjusted for longer delay
    }
  }

  startGame() {
    this.game.init(this.isSinglePlayer, this.p1sym);
    document.querySelectorAll('.gridblock span').forEach(span => {
      span.classList.remove('color-win');
      span.textContent = '';
    });
    document.getElementById('caption').style.display = 'none';
    document.getElementById('reset').style.visibility = 'visible';
    this.showElement('grid');
  }

  resetGame() {
    this.hideElement('grid');
    this.hideElement('message');
    this.showElement('num-players');
  }
}

// Initialize the TicTacToeUI class
new TicTacToeUI();
