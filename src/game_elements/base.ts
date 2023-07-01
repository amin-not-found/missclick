namespace GameElements {
  export type ElementProcessor = (creator: ElementCreator) => ElementCreator;

  export class ElementCreator {
    element: HTMLElement;
    constructor(tagName: string) {
      this.element = document.createElement(tagName);
    }
    setText(text: string): ElementCreator {
      this.element.innerHTML = text;
      return this;
    }
    setId(id: string): ElementCreator {
      this.element.id = id;
      return this;
    }
    addClass(clss: string) : ElementCreator {
      this.element.classList.add(clss);
      return this;
    }
    setPositionV(x_vh: string, y_vh: string): ElementCreator {
      this.element.style.bottom = y_vh;
      this.element.style.right = x_vh;
      return this;
    }
    onClick(func: (event: Event) => void): ElementCreator {
      this.element.addEventListener("click", func);
      return this;
    }
    onHover(func: (event: Event) => void): ElementCreator {
      this.element.addEventListener("mouseover", func);
      return this;
    }
    toElement() {
      return this.element;
    }
  }

  export abstract class GameElement {
    constructor(
      readonly process?: ElementProcessor
    ) { }
    abstract create(): ElementCreator;
    render(): HTMLElement {
      let creator = this.create()
      if (this.process) creator = this.process(creator);
      return creator.toElement()
    }
  }
}
