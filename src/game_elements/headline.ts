/// <reference path="base.ts" />
namespace GameElements {
    export namespace Headlines { 
        export interface IHeadline extends IGameElement {
            text: string;
        }
        
        export class SimpleHeadline implements IHeadline {
            constructor(
                public text: string,
            ){}
            render = () => new ElementCreator("h1").setId("headline").setText(this.text).toElement();
        }
    }
}