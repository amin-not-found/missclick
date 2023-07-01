let gameManager: GameManager;

window.onload = function () {
  gameManager = new GameManager();
};

//// Note to my future self
// StupidGame is broken because hover is not working.
// alert as win message is messing up the game.

//// TODO
// check for pointerlock browser support
// New game mode: AwayGame
// Don't let the cursor position reset to 0,0
// Sometimes the stats open when the button for starting the next game is pressed
// if canWin() returned false in changeGameMode() then go to CheatGame(game mode that doesn't have a win button)
