namespace GameModes {
  export interface IGameMode {
    readonly state: GameState;
    setupEvents(): void;
    canWin(): boolean;
  }

  export let availableModes: GameModeRepresentor[] = [];
  type Constructor<T> = {
    new (...args: any[]): T;
    readonly prototype: T;
  };
  export class GameModeRepresentor {
    constructor(
      public name: string,
      public probability: number,
      public classConstructor: Constructor<IGameMode>
    ) {}
  }
  function listGameMode(name: string, probability: number) {
    return function <T extends Constructor<IGameMode>>(target: T) {
      let mode = new GameModeRepresentor(name, probability, target);
      availableModes.push(mode);
    };
  }

  class GameMode implements IGameMode {
    protected _state: GameState;
    elements: GameElements.IGameElement[];

    constructor(gameElements: GameElements.IGameElement[]) {
      this.elements = gameElements;
      this._state = new GameState(gameElements);
    }

    get state(): GameState {
      return this._state;
    }

    updateMousePos(event: MouseEvent, xRatio = 1, yRatio = 1) {
      this._state.cursorPos.x += event.movementX * xRatio;
      this._state.cursorPos.y += event.movementY * yRatio;

      if (this.state.cursorPos.x >= window.innerWidth) {
        this._state.cursorPos.x -= window.innerWidth;
      } else if (this.state.cursorPos.x < 0) {
        this._state.cursorPos.x += window.innerWidth;
      }
      if (this.state.cursorPos.y >= window.innerHeight) {
        this._state.cursorPos.y -= window.innerHeight;
      } else if (this.state.cursorPos.y < 0) {
        this._state.cursorPos.y += window.innerHeight;
      }
    }

    updateMouse() {
      document.getElementById("cursor")?.remove();
      let cursor = document.createElement("img");
      cursor.id = "cursor";
      cursor.src = "assets/cursors/" + this.state.cursor;
      cursor.style.left = this._state.cursorPos.x + "px";
      cursor.style.top = this._state.cursorPos.y + "px";
      document.body.appendChild(cursor);
    }

    setupEvents() {
      window.onclick = (event: MouseEvent) => gameManager.onClick(event);
      window.onmousemove = (event: MouseEvent) => {
        this.updateMousePos(event);
        this.updateMouse();
      };
    }
    // Default behaviour for games that have a game with EndGame button
    canWin() {
      let elementUnderCursor = document.elementFromPoint(
        this._state.cursorPos.x,
        this._state.cursorPos.y
      );
      if (elementUnderCursor?.id === "end-game-button") {
        return true;
      }
      return false;
    }
  }

  @listGameMode("StupidGame", 3)
  export class StupidGame extends GameMode implements IGameMode {
    constructor() {
      super([
        new GameElements.Headlines.SimpleHeadline("Are you dumb?"),
        new GameElements.Buttons.EndGameButton(
          "Yes",
          "Happy we both can agree on that :)"
        ),
        new GameElements.Buttons.RunningButton(),
      ]);
      this._state = new GameState(this.elements, simpleDiv, "normal.png");
    }
    updateMouse(): void {
      super.updateMouse();
      let elementUnderCursor = document.elementFromPoint(
        this._state.cursorPos.x,
        this._state.cursorPos.y
      ) as HTMLElement;
      if (document.getElementById("running_btn") === elementUnderCursor) {
        elementUnderCursor.style.top = Math.round(randomNumber(-40, 40)) + "vh";
        elementUnderCursor.style.left =
          Math.round(randomNumber(-40, 40)) + "vw";
      }
    }
  }

  @listGameMode("PrisonGame", 3)
  export class PrisonGame extends GameMode implements IGameMode {
    constructor() {
      super([
        new GameElements.Headlines.SimpleHeadline(
          "Haha, got you imprisoned.<br>Maybe if you <u>try hard</u>,<br> I will let you out of your cell."
        ),
        new GameElements.Buttons.EndGameButton(
          "Get me out of this prison",
          "Congrats. For a second there I thought you wouldn't make it :)"
        ),
        new GameElements.Areas.Prison(),
      ]);
      this._state.customStates["clicks"] = 0;
    }

    updateMousePos(event: MouseEvent): void {
      super.updateMousePos(event);
      var prison = document.getElementById("prison");
      let rect = prison!.getBoundingClientRect();
      let radius = rect.width / 2 - 9;
      let center = new Vector(rect.x + radius, rect.y + radius);

      var v = this._state.cursorPos.substract(center);
      if (v.length() > radius) {
        this._state.cursorPos = center.add(
          v.normalize().multiplyScaler(radius)
        );
      }
    }

    onClick() {
      this._state.customStates["clicks"]++;
      let clickCount = this._state.customStates["clicks"];

      if (clickCount >= 100) {
        document.getElementById("prison")?.remove();
        this.updateMousePos = super.updateMousePos;
      }
      if (clickCount >= 10) {
        document.getElementById(
          "headline"
        )!.innerHTML = `Ok. I get it after ${clickCount} clicks.<br> Here's the deal:<br> Just click 100 times ;)`;
      }
    }

    setupEvents(): void {
      super.setupEvents();
      document
        .getElementById("prison")
        ?.addEventListener("click", () => this.onClick());
    }

    canWin(): boolean {
      return this._state.customStates["clicks"] >= 100;
    }
  }

  @listGameMode("SlowGame", 3)
  export class SlowGame extends GameMode implements IGameMode {
    private speedRatio: number = 0.007;
    constructor() {
      super([
        new GameElements.Headlines.SimpleHeadline("Patience is a virtue"),
        new GameElements.Buttons.EndGameButton(
          "No",
          "Yes, it is. Anyway, Congrats and happy to see you here :)"
        ),
      ]);
      this._state = new GameState(this.elements);
      this._state.cursorPos = randomCornerLocation();
    }
    updateMousePos(event: MouseEvent): void {
      super.updateMousePos(event, this.speedRatio, this.speedRatio);
    }
    canWin(): boolean {
      let res = super.canWin();
      if (res) {
        this.speedRatio = 1;
      }
      return res;
    }
  }
  @listGameMode("DrunkGame", 3)
  export class DrunkGame extends GameMode implements IGameMode {
    private minRatio: number = -0.6;
    private maxRatio: number = 0.66;
    constructor() {
      super([
        new GameElements.Headlines.SimpleHeadline(
          "You shouldn't have drunk this much"
        ),
        new GameElements.Buttons.EndGameButton(
          "Get sober",
          "Congrats. I guess you're not that drunk after all :)"
        ),
      ]);
      this._state = new GameState(this.elements);
      this._state.cursorPos = randomCornerLocation();
    }
    updateMousePos(event: MouseEvent): void {
      super.updateMousePos(
        event,
        randomNumber(this.minRatio, this.maxRatio),
        randomNumber(this.minRatio, this.maxRatio)
      );
    }
    canWin(): boolean {
      let res = super.canWin();
      if (res) {
        this.maxRatio = this.minRatio = 1;
      }
      return res;
    }
  }
  @listGameMode("FastGame", 3)
  export class FastGame extends GameMode implements IGameMode {
    private xRatio: number = -140;
    private yRatio: number = -70;
    constructor() {
      super([
        new GameElements.Headlines.SimpleHeadline(
          "Slow and steady<br>wins the race"
        ),
        new GameElements.Buttons.EndGameButton(
          "Speeeeeed",
          "Oh, here you are.\nCouldn't see you while you were moving that fast."
        ),
      ]);
      this._state = new GameState(this.elements);
      this._state.cursorPos = randomCornerLocation();
    }
    updateMousePos(event: MouseEvent): void {
      super.updateMousePos(event, this.xRatio, this.yRatio);
    }
    canWin(): boolean {
      let res = super.canWin();
      if (res) {
        this.xRatio = this.yRatio = 1;
      }
      return res;
    }
  }
}
