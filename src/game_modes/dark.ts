/// <reference path= "base.ts" />
namespace GameModes {
    @listGameMode("DarkGame", 3)
    export class DarkGame extends GameMode implements IGameMode {
        constructor() {
            super([
                new GameElements.Headlines.Headline("It's really Dark here<br>Who turned the lights off?"),
                new GameElements.Buttons.LostEndGameButton("Lights on"),
            ]);
            this._state = new GameState(this.elements, simpleDiv, "lantern.png");
        }
        setupEvents(): void {
            super.setupEvents();
            this.updateMouse();
        }
        updateMouse(): void {
            console.log(this._state.cursorPos);
            super.updateMouse();
            document.getElementById("cursor")!.classList.add("lantern-cursor");
        }
        cleanup(): void {
            document.getElementById("cursor")!.classList.remove("lantern-cursor");
            this.updateMouse = super.updateMouse;
        }
    }
}