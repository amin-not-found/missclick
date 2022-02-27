function emptyBackground(state: GameState): Element {
    return document.createElement("div");
}

interface GameElement {
    render(): Element;
}

class GameState {
    constructor(
        readonly elements: GameElement[],
        readonly buildRootElement: (state: GameState) => Element,
        readonly cursor: String,
    ) { }
    render(): Element {
        let rootElement = this.buildRootElement(this);
        for (const element of this.elements) {
            rootElement.appendChild(element.render())
        }
        rootElement.id = "game";
        return rootElement;
    }
}