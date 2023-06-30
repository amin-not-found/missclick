/// <reference path= "base.ts" />
namespace GameModes {
    @listGameMode("DumbGame", 3)
    export class DumbGame extends GameMode implements IGameMode {
      constructor() {
        super([
          new GameElements.Headlines.SimpleHeadline("Are you dumb?"),
          new GameElements.Buttons.EndGameButton(
            "Yes",
            "Happy we both can agree on that :)"
          ),
          new GameElements.Buttons.RunningButton("No"),
        ]);
        this._state = new GameState(this.elements);
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
}