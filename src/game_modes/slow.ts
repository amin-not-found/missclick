/// <reference path= "base.ts" />
namespace GameModes {
    @listGameMode("SlowGame", 3)
    export class SlowGame extends GameMode implements IGameMode {
      private speedRatio: number = 0.007;
      constructor() {
        super([
          new GameElements.Headlines.Headline("Patience is a virtue"),
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
      
      cleanup(): void {
        this.speedRatio = 1;
      }
    }
}