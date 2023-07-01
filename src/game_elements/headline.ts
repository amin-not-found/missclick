/// <reference path="base.ts" />
namespace GameElements {
  export namespace Headlines {
    export class Headline extends GameElement {
      constructor(public text: string, process?: ElementProcessor) { super(process) }
      create() {
        return new ElementCreator("h1")
          .setId("headline")
          .setText(this.text);
      }
    }
  }
}
