/// <reference path= "base.ts" />
namespace GameModes {
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
}