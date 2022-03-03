var gameManager: GameManager;

window.onload = function () {
  gameManager = new GameManager();
};

//// Note to my future self
// StupidGame is broken because hover is not working.
// alert as win message is messing up the game.

//// TODO
// New game mode: DarkGame
// New game mode: AwayGame
// Don't let the cursor position reset to 0,0
// if canWin() returned false in changeGameMode() then go to CheatGame(game mode that doesn't have a win button)
