class GameManager {
  // Default is set to PrisonGame for purpose of showcasing the new mode
  private game: GameModes.IGameMode = new GameModes.PrisonGame();

  renderGame() {
    document.getElementById("game")?.remove();
    document.body.appendChild(this.game.state.render());
  }

  private newGame(): string {
    var i;
    var weights: number[] = [];
    let options = GameModes.availableModes;
    for (i = 0; i < options.length; i++)
      weights[i] = options[i].probability + (weights[i - 1] || 0);

    var random = Math.random() * weights[weights.length - 1];

    for (i = 0; i < weights.length; i++) if (weights[i] > random) break;

    let gameMode = options[i];
    this.game = new gameMode.classConstructor();
    this.renderGame();
    return gameMode.name;
  }

  changeGameMode(gameMessage: string) {
    if (!this.game.state.canWin) return;
    let modeName = this.newGame();
    alert(`${gameMessage}\nLet's play another round(${modeName}).`);
  }
}
