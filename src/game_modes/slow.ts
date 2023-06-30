/// <reference path= "base.ts" />
namespace GameModes {
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
}