/// <reference path= "base.ts" />
namespace GameElements {
  export namespace Areas {
    export interface IArea extends IGameElement {}

    export class Prison implements IArea {
      render(): HTMLElement {
        return new ElementCreator("div").setId("prison").toElement();
      }
    }
  }
}
