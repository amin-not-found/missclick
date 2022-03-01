class GameManager {
  // Default is set to PrisonGame for purpose of showcasing the new mode
  private game: GameModes.IGameMode = new GameModes.SlowGame();

  renderGame() {
    document.getElementById("game")?.remove();
    document.body.prepend(this.game.state.render());
    window.onclick = (event) => this.onClick(event);
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
    alert(
      `${gameMessage}\nLet's play another round which is going to be ${modeName}.`
    );
  }

  mouseOut() {
    var alert = document.getElementById("mouse-alert")!;
    if (alert.className === "mouseout-alert") alert.className = "mousein-alert";
  }
  mouseIn() {
    document.getElementById("mouse-alert")!.className = "mouseout-alert";
  }
  onClick(event: MouseEvent) {
    let pos = this.game.state.cursorPos;
    (document.elementFromPoint(pos.x, pos.y) as HTMLElement).click();
  }
}
