/// <reference path= "base.ts" />
namespace GameElements {
  export namespace Buttons {
    interface IButton extends IGameElement {
      readonly text: string;
    }

    export class EndGameButton implements IButton {
      constructor(
        readonly text: string,
        readonly message: string = "Congrats. For a second there I thought you wouldn't make it :)"
      ) {}
      render(): HTMLElement {
        return new ElementCreator("button")
          .setText(this.text)
          .setId("end-game-button")
          .onClick(() => this.onClick())
          .toElement();
      }
      onClick(): void {
        gameManager.changeGameMode(this.message);
      }
    }

    export class RunningButton implements IButton {
      readonly text: string = "No";
      render(): HTMLElement {
        return new ElementCreator("button")
          .setId("running_btn")
          .setText("No")
          .toElement();
      }
    }
  }
}
