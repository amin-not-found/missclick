function simpleDiv(state: GameState): Element {
  return document.createElement("div");
}

class GameState {
  cursorPos: Vector;
  constructor(
    readonly elements: GameElements.IGameElement[],
    readonly buildRootElement: (state: GameState) => Element = simpleDiv,
    readonly cursor: String = "normal.png",
    public canWin = false,
    public customStates: Record<string, any> = {}
  ) {
    this.cursorPos = new Vector(0, 0);
  }
  render(): Element {
    let rootElement = this.buildRootElement(this);
    for (const element of this.elements) {
      rootElement.appendChild(element.render());
    }
    rootElement.id = "game";
    return rootElement;
  }
}
