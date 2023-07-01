/// <reference path= "base.ts" />
namespace GameElements {
  export namespace Areas {
    export abstract class Area extends GameElement {}

    export class Prison extends Area {
      create() {
        return new ElementCreator("div").setId("prison");
      }
    }
  }
}
