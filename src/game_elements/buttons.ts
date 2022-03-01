/// <reference path= "base.ts" />
namespace GameElements {
  export namespace Buttons {
    interface IButton extends IGameElement {
      readonly text: string;
    }

    export class RunningButton implements IButton {
      readonly text: string = "No";
      private pos: Vector = new Vector(0, 0);
      render(): HTMLElement {
        return new ElementCreator("button")
          .setId("running_btn")
          .onHover(() => this.onHover())
          .setText("No")
          .setPositionV(this.pos.x + "vh", this.pos.y + "vh")
          .toElement();
      }
      onHover(): void {
        this.pos.x = getRandomArbitrary(-40, 40);
        this.pos.y = getRandomArbitrary(-40, 40);
        gameManager.renderGame();
      }
    }
    export class ImStupidButton implements IButton {
      readonly text: string = "Yes";
      render(): HTMLElement {
        return new ElementCreator("button")
          .setText(this.text)
          .onClick(() => this.onClick())
          .toElement();
      }
      onClick(): void {
        gameManager.changeGameMode("Happy we both can agree on that :)");
      }
    }
    export class PrisonButton implements IButton {
      readonly text: string = "Get me out of this prison";
      render(): HTMLElement {
        return new ElementCreator("button")
          .setText(this.text)
          .onClick(() => this.onClick())
          .toElement();
      }
      onClick(): void {
        gameManager.changeGameMode(
          "Congrats. For a second there I thought you wouldn't make it :)"
        );
      }
    }
    export class SlowGameButton implements IButton {
      readonly text: string = "No";
      render(): HTMLElement {
        return new ElementCreator("button")
          .setText(this.text)
          .onClick(() => this.onClick())
          .toElement();
      }
      onClick(): void {
        gameManager.changeGameMode(
          "Yes, it is. Anyway, happy to see you here."
        );
      }
    }
  }
}
