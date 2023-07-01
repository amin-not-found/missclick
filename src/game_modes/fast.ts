/// <reference path= "base.ts" />
namespace GameModes {
    @listGameMode("FastGame", 3)
    export class FastGame extends GameMode implements IGameMode {
      constructor() { 
        super([
          new GameElements.Headlines.Headline(
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
        let btn = document.getElementById("end-game-button")!;
        let xRatio = btn.clientWidth -1;
        let yRatio = btn.clientHeight -1;
        super.updateMousePos(event, xRatio/10, yRatio/10);
      }
      cleanup(): void {
        super.cleanup();
        this.updateMousePos = super.updateMousePos;
      }
    }
}