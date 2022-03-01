namespace GameModes {
  export interface IGameMode {
    readonly state: GameState;
    updateMouse(): void;
    updateMousePos(event: MouseEvent): void;
  }

  export let availableModes: GameModeRepresentor[] = [];
  type Constructor<T> = {
    new (...args: any[]): T;
    readonly prototype: T;
  };
  class GameModeRepresentor {
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

  class GameMode {
    protected _state: GameState;
    elements: GameElements.IGameElement[];

    constructor(gameElements: GameElements.IGameElement[]) {
      this.elements = gameElements;
      this._state = new GameState(gameElements);
      window.onmousemove = (event) => {
        this.updateMousePos(event);
        this.updateMouse();
      };
    }

    get state(): GameState {
      return this._state;
    }

    updateMousePos(event: MouseEvent) {
      this._state.cursorPos.x = event.pageX;
      this._state.cursorPos.y = event.pageY;
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
  }

  @listGameMode("StupidGame", 3)
  export class StupidGame extends GameMode implements IGameMode {
    constructor() {
      super([
        new GameElements.Headlines.SimpleHeadline("Are you dumb?"),
        new GameElements.Buttons.ImStupidButton(),
        new GameElements.Buttons.RunningButton(),
      ]);
      this._state = new GameState(this.elements, simpleDiv, "normal.png", true);
    }
  }

  @listGameMode("PrisonGame", 3)
  export class PrisonGame extends GameMode implements IGameMode {
    constructor() {
      super([
        new GameElements.Headlines.SimpleHeadline(
          "Haha, got you imprisoned.<br>Maybe if you <u>try hard</u>,<br> I will let you out of your cell."
        ),
        new GameElements.Buttons.PrisonButton(),
        new GameElements.Areas.Prison(),
      ]);
      this._state.customStates["clicks"] = 0;
      window.onclick = () => this.onClick();
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
        window.onclick = null;
        document.getElementById("prison")!.remove();
        this.updateMousePos = super.updateMousePos;
        this._state.canWin = true;
      }
      if (clickCount >= 10) {
        document.getElementById(
          "headline"
        )!.innerHTML = `Ok. I get it after ${clickCount} clicks.<br> Here's the deal:<br> Just click 100 times ;)`;
      }
    }
  }

  @listGameMode("SlowGame", 3)
  export class SlowGame extends GameMode implements IGameMode {
    private speedRatio: number = 0.09;
    constructor() {
      super([
        new GameElements.Headlines.SimpleHeadline("Patience is a virtue"),
        new GameElements.Buttons.SlowGameButton(),
      ]);
      this._state = new GameState(this.elements, simpleDiv, "normal.png", true);
      window.onmouseover = () => gameManager.mouseOut();
      window.onmouseout = () => gameManager.mouseIn();
    }
    updateMousePos(event: MouseEvent): void {
      this._state.cursorPos.x += event.movementX * this.speedRatio;
      this._state.cursorPos.y += event.movementY * this.speedRatio;
    }
  }
}
