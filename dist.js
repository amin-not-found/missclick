"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var gameManager;
window.onload = function () {
    gameManager = new GameManager();
    gameManager.renderGame();
};
class GameManager {
    constructor() {
        // Default is set to PrisonGame for purpose of showcasing the new mode
        this.game = new GameModes.PrisonGame();
    }
    renderGame() {
        var _a;
        (_a = document.getElementById("game")) === null || _a === void 0 ? void 0 : _a.remove();
        document.body.appendChild(this.game.state.render());
    }
    newGame() {
        var i;
        var weights = [];
        let options = GameModes.availableModes;
        for (i = 0; i < options.length; i++)
            weights[i] = options[i].probability + (weights[i - 1] || 0);
        var random = Math.random() * weights[weights.length - 1];
        for (i = 0; i < weights.length; i++)
            if (weights[i] > random)
                break;
        let gameMode = options[i];
        this.game = new gameMode.classConstructor();
        this.renderGame();
        return gameMode.name;
    }
    changeGameMode(gameMessage) {
        if (!this.game.state.canWin)
            return;
        let modeName = this.newGame();
        alert(`${gameMessage}\nLet's play another round(${modeName}).`);
    }
}
var GameModes;
(function (GameModes) {
    GameModes.availableModes = [];
    class GameModeRepresentor {
        constructor(name, probability, classConstructor) {
            this.name = name;
            this.probability = probability;
            this.classConstructor = classConstructor;
        }
    }
    function listGameMode(name, probability) {
        return function (target) {
            let mode = new GameModeRepresentor(name, probability, target);
            GameModes.availableModes.push(mode);
        };
    }
    class GameMode {
        constructor(gameElements) {
            this.elements = gameElements;
            this._state = new GameState(gameElements);
            window.onmousemove = (event) => {
                this.updateMousePos(event);
                this.updateMouse();
            };
        }
        get state() { return this._state; }
        updateMousePos(event) {
            this._state.cursorPos.x = event.pageX;
            this._state.cursorPos.y = event.pageY;
        }
        updateMouse() {
            var _a;
            (_a = document.getElementById("cursor")) === null || _a === void 0 ? void 0 : _a.remove();
            let cursor = document.createElement("img");
            cursor.id = "cursor";
            cursor.src = "assets/cursors/" + this.state.cursor;
            cursor.style.left = this._state.cursorPos.x + "px";
            cursor.style.top = this._state.cursorPos.y + "px";
            document.body.appendChild(cursor);
        }
    }
    let StupidGame = class StupidGame extends GameMode {
        constructor() {
            super([
                new GameElements.Headlines.SimpleHeadline("Are you dumb?"),
                new GameElements.Buttons.ImStupidButton(),
                new GameElements.Buttons.RunningButton()
            ]);
            this._state = new GameState(this.elements, simpleDiv, "normal.png", true);
        }
    };
    StupidGame = __decorate([
        listGameMode("StupidGame", 3)
    ], StupidGame);
    GameModes.StupidGame = StupidGame;
    let PrisonGame = class PrisonGame extends GameMode {
        constructor() {
            super([
                new GameElements.Headlines.SimpleHeadline("Haha, got you imprisoned.<br>Maybe if you <u>try hard</u>,<br> I will let you out of your cell."),
                new GameElements.Buttons.PrisonButton(),
                new GameElements.Areas.Prison(),
            ]);
            this._state.customStates['clicks'] = 0;
            window.onclick = () => this.onClick();
        }
        updateMousePos(event) {
            super.updateMousePos(event);
            var prison = document.getElementById("prison");
            let rect = prison.getBoundingClientRect();
            let radius = rect.width / 2 - 9;
            let center = new Vector(rect.x + radius, rect.y + radius);
            var v = this._state.cursorPos.substract(center);
            if (v.length() > radius) {
                this._state.cursorPos = center.add(v.normalize().multiplyScaler(radius));
            }
        }
        onClick() {
            this._state.customStates['clicks']++;
            let clickCount = this._state.customStates['clicks'];
            // Headline is first elemets of this.elemets array
            if (clickCount >= 100) {
                window.onclick = null;
                document.getElementById("prison").remove();
                this.updateMousePos = super.updateMousePos;
                this._state.canWin = true;
            }
            if (clickCount >= 10) {
                document.getElementById("headline").innerHTML = `Ok. I get it after ${clickCount} clicks.<br> Here's the deal:<br> Just click 100 times ;)`;
            }
        }
    };
    PrisonGame = __decorate([
        listGameMode("PrisonGame", 3)
    ], PrisonGame);
    GameModes.PrisonGame = PrisonGame;
})(GameModes || (GameModes = {}));
function simpleDiv(state) {
    return document.createElement("div");
}
class GameState {
    constructor(elements, buildRootElement = simpleDiv, cursor = "normal.png", canWin = false, customStates = {}) {
        this.elements = elements;
        this.buildRootElement = buildRootElement;
        this.cursor = cursor;
        this.canWin = canWin;
        this.customStates = customStates;
        this.cursorPos = new Vector(0, 0);
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
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function weightedChoice(weights) {
    var random = Math.random() * weights[weights.length - 1];
    let i = 0;
    for (; i < weights.length; i++)
        if (weights[i] > random)
            break;
    return i;
}
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    substract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }
    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }
    divideScaler(scaler) {
        return new Vector(this.x / scaler, this.y / scaler);
    }
    multiplyScaler(scaler) {
        return new Vector(this.x * scaler, this.y * scaler);
    }
    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    normalize() {
        return this.divideScaler(this.length());
    }
}
var GameElements;
(function (GameElements) {
    class ElementCreator {
        constructor(tagName) {
            this.element = document.createElement(tagName);
        }
        setText(text) {
            this.element.innerHTML = text;
            return this;
        }
        setId(id) {
            this.element.id = id;
            return this;
        }
        setPositionV(x_vh, y_vh) {
            this.element.style.bottom = y_vh;
            this.element.style.right = x_vh;
            return this;
        }
        onClick(func) {
            this.element.addEventListener("click", func);
            return this;
        }
        onHover(func) {
            this.element.addEventListener("mouseover", func);
            return this;
        }
        toElement() {
            return this.element;
        }
    }
    GameElements.ElementCreator = ElementCreator;
})(GameElements || (GameElements = {}));
/// <reference path= "base.ts" />
var GameElements;
(function (GameElements) {
    let Areas;
    (function (Areas) {
        class Prison {
            render() {
                return new GameElements.ElementCreator("div").setId("prison").toElement();
            }
        }
        Areas.Prison = Prison;
    })(Areas = GameElements.Areas || (GameElements.Areas = {}));
})(GameElements || (GameElements = {}));
/// <reference path= "base.ts" />
var GameElements;
(function (GameElements) {
    let Buttons;
    (function (Buttons) {
        class RunningButton {
            constructor() {
                this.text = "No";
                this.pos = new Vector(0, 0);
            }
            render() {
                return new GameElements.ElementCreator("button").setId("running_btn").onHover(() => this.onHover())
                    .setText("No").setPositionV(this.pos.x + "vh", this.pos.y + "vh").toElement();
            }
            onHover() {
                this.pos.x = getRandomArbitrary(-40, 40);
                this.pos.y = getRandomArbitrary(-40, 40);
                gameManager.renderGame();
            }
        }
        Buttons.RunningButton = RunningButton;
        class ImStupidButton {
            constructor() {
                this.text = "Yes";
            }
            render() {
                return new GameElements.ElementCreator("button").setText(this.text).onClick(() => this.onClick()).toElement();
            }
            onClick() {
                gameManager.changeGameMode("Happy we both can agree on that :)");
            }
        }
        Buttons.ImStupidButton = ImStupidButton;
        class PrisonButton {
            constructor() {
                this.text = "Get me out of this prison";
            }
            render() {
                return new GameElements.ElementCreator("button").setText(this.text).onClick(() => this.onClick()).toElement();
            }
            onClick() {
                gameManager.changeGameMode("Congrats. For a second there I thought you wouldn't make it :)");
            }
        }
        Buttons.PrisonButton = PrisonButton;
    })(Buttons = GameElements.Buttons || (GameElements.Buttons = {}));
})(GameElements || (GameElements = {}));
/// <reference path="base.ts" />
var GameElements;
(function (GameElements) {
    let Headlines;
    (function (Headlines) {
        class SimpleHeadline {
            constructor(text) {
                this.text = text;
                this.render = () => new GameElements.ElementCreator("h1").setId("headline").setText(this.text).toElement();
            }
        }
        Headlines.SimpleHeadline = SimpleHeadline;
    })(Headlines = GameElements.Headlines || (GameElements.Headlines = {}));
})(GameElements || (GameElements = {}));
