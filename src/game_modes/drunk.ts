/// <reference path= "base.ts" />
namespace GameModes {
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
}