function defaultHeadlineRender(this: Button): Element {
    let element = document.createElement("h1");
    element.innerHTML = this.text;
    return element;
}

interface Headline {
    readonly text: string;
    render(): Element;
}

class StupidHeadline implements Headline {
    render: (this: Button) => Element = defaultHeadlineRender;
    readonly text: string = "Are you dumb?";
}