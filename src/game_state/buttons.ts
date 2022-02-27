function defaultBtnRender(this: Button): HTMLElement {
    let element = document.createElement("button");
    element.innerHTML = this.text;
    return element;
}

interface Button {
    readonly text: string;
    render(id: string | null): HTMLElement;
    // Buttons *can* have onClick and onHover methods
}

class RunningButton implements Button {
    readonly text: string = "No";
    private x: number = 0;
    private y: number = 0;
    render(): HTMLElement {
        let element = defaultBtnRender.call(this);
        element.id = "running_btn";
        element.style.bottom = this.y + "vh";
        element.style.right = this.x + "vh";
        element.addEventListener("mouseover", () => this.onHover());
        return element
    }
    onHover() {
        this.x = getRandomArbitrary(-70, 70);
        this.y = getRandomArbitrary(-40, 40);
        gameManager.renderGame()
    }
}
class ImStupidButton implements Button {
    readonly text: string = "Yes";
    render(): HTMLElement {
        let element = defaultBtnRender.call(this);
        element.addEventListener("click", () => this.onClick());
        return element
    }
    onClick(): void {
        alert("Happy we both can agree on that :)");
    }
}
