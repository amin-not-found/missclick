"use strict";
var gameManager;
window.onload = function () {
    gameManager = new GameManager();
    gameManager.renderGame();
    // I'm using an arrow function because it's an easy way to preserve gameManger's context
    window.onmousemove = (event) => gameManager.gameMode.mouseUpdate(event);
    window.onclick = function (event) {
        var _a;
        (_a = document.getElementById("cursor")) === null || _a === void 0 ? void 0 : _a.remove();
        let element = document.elementFromPoint(event.pageX, event.pageY);
        element === null || element === void 0 ? void 0 : element.click();
    };
};
class GameManager {
    constructor() {
        this.gameMode = new StupidGame(this.renderGame);
    }
    renderGame() {
        var _a;
        (_a = document.getElementById("game")) === null || _a === void 0 ? void 0 : _a.remove();
        document.body.appendChild(this.gameMode.state.render());
    }
}
class StupidGame {
    constructor(renderGame) {
        this.renderGame = renderGame;
        let gameElements = [
            new StupidHeadline(),
            new ImStupidButton(),
            new RunningButton()
        ];
        this._state = new GameState(gameElements, emptyBackground, "normal.png");
    }
    get state() { return this._state; }
    get cursor() { return this._state.cursor; }
    mouseUpdate(event) {
        var _a;
        (_a = document.getElementById("cursor")) === null || _a === void 0 ? void 0 : _a.remove();
        let cursor = document.createElement("img");
        cursor.id = "cursor";
        cursor.src = "assets/cursors/" + this.state.cursor;
        cursor.style.left = event.pageX + "px";
        cursor.style.top = event.pageY + "px";
        document.body.appendChild(cursor);
    }
}
function defaultHeadlineRender() {
    let element = document.createElement("h1");
    element.innerHTML = this.text;
    return element;
}
class StupidHeadline {
    constructor() {
        this.render = defaultHeadlineRender;
        this.text = "Are you dumb?";
    }
}
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function defaultBtnRender() {
    let element = document.createElement("button");
    element.innerHTML = this.text;
    return element;
}
class RunningButton {
    constructor() {
        this.text = "No";
        this.x = 0;
        this.y = 0;
    }
    render() {
        let element = defaultBtnRender.call(this);
        element.id = "running_btn";
        element.style.bottom = this.y + "vh";
        element.style.right = this.x + "vh";
        element.addEventListener("mouseover", () => this.onHover());
        return element;
    }
    onHover() {
        this.x = getRandomArbitrary(-70, 70);
        this.y = getRandomArbitrary(-40, 40);
        gameManager.renderGame();
    }
}
class ImStupidButton {
    constructor() {
        this.text = "Yes";
    }
    render() {
        let element = defaultBtnRender.call(this);
        element.addEventListener("click", () => this.onClick());
        return element;
    }
    onClick() {
        alert("Happy we both can agree on that :)");
    }
}
function emptyBackground(state) {
    return document.createElement("div");
}
class GameState {
    constructor(elements, buildRootElement, cursor) {
        this.elements = elements;
        this.buildRootElement = buildRootElement;
        this.cursor = cursor;
    }
    render() {
        let rootElement = this.buildRootElement(this);
        for (const element of this.elements) {
            rootElement.appendChild(element.render());
        }
        rootElement.id = "game";
        return rootElement;
    }
}
