/// <reference path= "base.ts" />
namespace GameModes {
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