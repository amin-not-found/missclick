class GameManager {
  // Default is set to PrisonGame for purpose of showcasing the new mode
  //private game: GameModes.IGameMode = new GameModes.StupidGame();
  private game: GameModes.IGameMode | null = null;
  private gameName?: string;

  constructor() {
    this.setupGame(this.createNewGame());
    document.onpointerlockchange = () => this.handlePointerLockChange();
  }

  setupGame(gameMode: GameModes.GameModeRepresentor) {
    this.gameName = gameMode.name;
    this.game = new gameMode.classConstructor();
    this.renderGame();
    this.game.setupEvents();
  }

  renderGame() {
    document.getElementById("game")?.remove();
    document.body.prepend(this.game!.state.render());
    window.onclick = (event) => this.onClick(event);
  }

  private createNewGame(): GameModes.GameModeRepresentor {
    if (!this.game) {
      return GameModes.availableModes.find(
        (gameMode) => gameMode.name === "DumbGame"
      )!;
    } else if (!this.game.canWin()) {
      // TODO : change to CheatGame
      return GameModes.availableModes.find(
        (gameMode) => gameMode.name === "SlowGame"
      )!;
    }
    var i;
    let options = GameModes.availableModes;
    var weights: number[] = [];
    for (i = 0; i < options.length; i++)
      weights[i] = options[i].probability + (weights[i - 1] || 0);

    var random = Math.random() * weights[weights.length - 1];

    for (i = 0; i < weights.length; i++) if (weights[i] > random) break;

    return options[i];
  }

  changeGameMode(gameMessage: string) {
    let gameCount = parseInt(localStorage.getItem(this.gameName!) ?? "0");
    gameCount = Number.isNaN(gameCount) ? 0 : gameCount;
    localStorage.setItem(this.gameName!, (gameCount + 1).toString());

    this.game?.cleanup();

    let newGame = this.createNewGame();
    if (newGame == null) return;

    var winDialog = new GameElements.ElementCreator("div")
      .setId("win-dialog")
      .toElement();
    winDialog.appendChild(
      new GameElements.ElementCreator("h1").setText(gameMessage).toElement()
    );
    winDialog.appendChild(
      new GameElements.ElementCreator("button")
        .setText(
          `Let's play another round which is going to be ${newGame.name}.`
        )
        .onClick(() => {
          this.setupGame(newGame);
          winDialog.remove();
        })
        .toElement()
    );
    document.body.prepend(winDialog);
  }

  handlePointerLockChange() {
    if (document.pointerLockElement) {
      document.getElementById("mouse-alert")!.className = "mousein-alert";
    } else {
      window.onmousemove = null;
      document.getElementById("mouse-alert")!.className = "mouseout-alert";
    }
  }

  onClick(event: MouseEvent) {
    if (!document.pointerLockElement) document.body.requestPointerLock();
    let pos = this.game!.state.cursorPos;
    (document.elementFromPoint(pos.x, pos.y) as HTMLElement)?.click();
  }
}
