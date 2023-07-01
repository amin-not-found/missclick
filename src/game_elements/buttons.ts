/// <reference path= "base.ts" />
namespace GameElements {
  export namespace Buttons {
    export class Button extends GameElement {
      constructor(readonly text: string, process?: ElementProcessor ){
        super(process);
      }
      create() {
        return new ElementCreator("button").setText(this.text);
      }
    }


    export class EndGameButton extends Button {
      constructor(
        text: string,
        readonly message: string = "Congrats. For a second there I thought you wouldn't make it :)"
      ) {
        super(text);
      }
      create() {
        return super.create()
          .setId("end-game-button")
          .onClick(() => this.onClick());
      }
      onClick(): void {
        gameManager.changeGameMode(this.message);
      }
    }

    export class LostEndGameButton extends EndGameButton {
      create(): ElementCreator {
        return super.create().setId("absolute-btn");
      }
      render(): HTMLElement {
        let e = this.create().toElement();
        e.style.top = Math.round(randomNumber(-36, 42)) + "vh";
        e.style.left = Math.round(randomNumber(-24, 64)) + "vw";
        return e;
      }
    }

  }
}
