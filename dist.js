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
};
//// Note to my future self
// StupidGame is broken because hover is not working.
// alert as win message is messing up the game.
//// TODO
// New game mode: DarkGame
// New game mode: AwayGame
// Don't let the cursor position reset to 0,0
// if canWin() returned false in changeGameMode() then go to CheatGame(game mode that doesn't have a win button)
class GameManager {
    constructor() {
        // Default is set to PrisonGame for purpose of showcasing the new mode
        //private game: GameModes.IGameMode = new GameModes.StupidGame();
        this.game = null;
        this.setupGame(this.createNewGame());
        document.onpointerlockchange = () => this.handlePointerLockChange();
    }
    setupGame(gameMode) {
        this.gameName = gameMode.name;
        this.game = new gameMode.classConstructor();
        this.game.setupEvents();
        this.renderGame();
    }
    renderGame() {
        var _a;
        (_a = document.getElementById("game")) === null || _a === void 0 ? void 0 : _a.remove();
        document.body.prepend(this.game.state.render());
        document.body.requestPointerLock();
        window.onclick = (event) => this.onClick(event);
    }
    createNewGame() {
        if (!this.game) {
            return GameModes.availableModes.find((gameMode) => gameMode.name === "StupidGame");
        }
        else if (!this.game.canWin()) {
            // TODO : change to CheatGame
            return GameModes.availableModes.find((gameMode) => gameMode.name === "SlowGame");
        }
        var i;
        let options = GameModes.availableModes;
        var weights = [];
        for (i = 0; i < options.length; i++)
            weights[i] = options[i].probability + (weights[i - 1] || 0);
        var random = Math.random() * weights[weights.length - 1];
        for (i = 0; i < weights.length; i++)
            if (weights[i] > random)
                break;
        return options[i];
    }
    changeGameMode(gameMessage) {
        var _a, _b;
        let gameCountStr = (_a = localStorage.getItem(this.gameName)) !== null && _a !== void 0 ? _a : "0";
        let gameCount = parseInt(gameCountStr);
        gameCount = gameCount == NaN ? 0 : gameCount;
        localStorage.setItem(this.gameName, (gameCount + 1).toString());
        let newGame = this.createNewGame();
        if (newGame == null)
            return;
        (_b = document.getElementById("game")) === null || _b === void 0 ? void 0 : _b.remove();
        var winDialog = new GameElements.ElementCreator("div")
            .setId("win-dialog")
            .toElement();
        winDialog.appendChild(new GameElements.ElementCreator("h1").setText(gameMessage).toElement());
        winDialog.appendChild(new GameElements.ElementCreator("button")
            .setText(`Let's play another round which is going to be ${newGame.name}.`)
            .onClick(() => {
            this.setupGame(newGame);
            winDialog.remove();
        })
            .toElement());
        document.body.prepend(winDialog);
    }
    handlePointerLockChange() {
        if (document.pointerLockElement) {
            document.getElementById("mouse-alert").className = "mousein-alert";
            this.game.setupEvents();
        }
        else {
            window.onmousemove = null;
            document.getElementById("mouse-alert").className = "mouseout-alert";
        }
    }
    onClick(event) {
        var _a;
        if (!document.pointerLockElement)
            document.body.requestPointerLock();
        let pos = this.game.state.cursorPos;
        (_a = document.elementFromPoint(pos.x, pos.y)) === null || _a === void 0 ? void 0 : _a.click();
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
    GameModes.GameModeRepresentor = GameModeRepresentor;
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
        }
        get state() {
            return this._state;
        }
        updateMousePos(event, xRatio = 1, yRatio = 1) {
            this._state.cursorPos.x += event.movementX * xRatio;
            this._state.cursorPos.y += event.movementY * yRatio;
            if (this.state.cursorPos.x >= window.innerWidth) {
                this._state.cursorPos.x -= window.innerWidth;
            }
            else if (this.state.cursorPos.x < 0) {
                this._state.cursorPos.x += window.innerWidth;
            }
            if (this.state.cursorPos.y >= window.innerHeight) {
                this._state.cursorPos.y -= window.innerHeight;
            }
            else if (this.state.cursorPos.y < 0) {
                this._state.cursorPos.y += window.innerHeight;
            }
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
        setupEvents() {
            window.onclick = (event) => gameManager.onClick(event);
            window.onmousemove = (event) => {
                this.updateMousePos(event);
                this.updateMouse();
            };
        }
        // Default behaviour for games that have a game with EndGame button
        canWin() {
            let elementUnderCursor = document.elementFromPoint(this._state.cursorPos.x, this._state.cursorPos.y);
            if ((elementUnderCursor === null || elementUnderCursor === void 0 ? void 0 : elementUnderCursor.id) === "end-game-button") {
                return true;
            }
            return false;
        }
    }
    let StupidGame = class StupidGame extends GameMode {
        constructor() {
            super([
                new GameElements.Headlines.SimpleHeadline("Are you dumb?"),
                new GameElements.Buttons.EndGameButton("Yes", "Happy we both can agree on that :)"),
                new GameElements.Buttons.RunningButton(),
            ]);
            this._state = new GameState(this.elements, simpleDiv, "normal.png");
        }
        updateMouse() {
            super.updateMouse();
            let elementUnderCursor = document.elementFromPoint(this._state.cursorPos.x, this._state.cursorPos.y);
            if (document.getElementById("running_btn") === elementUnderCursor) {
                elementUnderCursor.style.top = Math.round(randomNumber(-40, 40)) + "vh";
                elementUnderCursor.style.left =
                    Math.round(randomNumber(-40, 40)) + "vw";
            }
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
                new GameElements.Buttons.EndGameButton("Get me out of this prison", "Congrats. For a second there I thought you wouldn't make it :)"),
                new GameElements.Areas.Prison(),
            ]);
            this._state.customStates["clicks"] = 0;
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
            var _a;
            this._state.customStates["clicks"]++;
            let clickCount = this._state.customStates["clicks"];
            if (clickCount >= 100) {
                (_a = document.getElementById("prison")) === null || _a === void 0 ? void 0 : _a.remove();
                this.updateMousePos = super.updateMousePos;
            }
            if (clickCount >= 10) {
                document.getElementById("headline").innerHTML = `Ok. I get it after ${clickCount} clicks.<br> Here's the deal:<br> Just click 100 times ;)`;
            }
        }
        setupEvents() {
            var _a;
            super.setupEvents();
            (_a = document
                .getElementById("prison")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => this.onClick());
        }
        canWin() {
            return this._state.customStates["clicks"] >= 100;
        }
    };
    PrisonGame = __decorate([
        listGameMode("PrisonGame", 3)
    ], PrisonGame);
    GameModes.PrisonGame = PrisonGame;
    let SlowGame = class SlowGame extends GameMode {
        constructor() {
            super([
                new GameElements.Headlines.SimpleHeadline("Patience is a virtue"),
                new GameElements.Buttons.EndGameButton("No", "Yes, it is. Anyway, Congrats and happy to see you here :)"),
            ]);
            this.speedRatio = 0.007;
            this._state = new GameState(this.elements);
            this._state.cursorPos = randomCornerLocation();
        }
        updateMousePos(event) {
            super.updateMousePos(event, this.speedRatio, this.speedRatio);
        }
        canWin() {
            let res = super.canWin();
            if (res) {
                this.speedRatio = 1;
            }
            return res;
        }
    };
    SlowGame = __decorate([
        listGameMode("SlowGame", 3)
    ], SlowGame);
    GameModes.SlowGame = SlowGame;
    let DrunkGame = class DrunkGame extends GameMode {
        constructor() {
            super([
                new GameElements.Headlines.SimpleHeadline("You shouldn't have drunk this much"),
                new GameElements.Buttons.EndGameButton("Get sober", "Congrats. I guess you're not that drunk after all :)"),
            ]);
            this.minRatio = -0.6;
            this.maxRatio = 0.66;
            this._state = new GameState(this.elements);
            this._state.cursorPos = randomCornerLocation();
        }
        updateMousePos(event) {
            super.updateMousePos(event, randomNumber(this.minRatio, this.maxRatio), randomNumber(this.minRatio, this.maxRatio));
        }
        canWin() {
            let res = super.canWin();
            if (res) {
                this.maxRatio = this.minRatio = 1;
            }
            return res;
        }
    };
    DrunkGame = __decorate([
        listGameMode("DrunkGame", 3)
    ], DrunkGame);
    GameModes.DrunkGame = DrunkGame;
    let FastGame = class FastGame extends GameMode {
        constructor() {
            super([
                new GameElements.Headlines.SimpleHeadline("Slow and steady<br>wins the race"),
                new GameElements.Buttons.EndGameButton("Speeeeeed", "Oh, here you are.\nCouldn't see you while you were moving that fast."),
            ]);
            this.xRatio = -140;
            this.yRatio = -70;
            this._state = new GameState(this.elements);
            this._state.cursorPos = randomCornerLocation();
        }
        updateMousePos(event) {
            super.updateMousePos(event, this.xRatio, this.yRatio);
        }
        canWin() {
            let res = super.canWin();
            if (res) {
                this.xRatio = this.yRatio = 1;
            }
            return res;
        }
    };
    FastGame = __decorate([
        listGameMode("FastGame", 3)
    ], FastGame);
    GameModes.FastGame = FastGame;
})(GameModes || (GameModes = {}));
function simpleDiv(state) {
    return document.createElement("div");
}
class GameState {
    constructor(elements, buildRootElement = simpleDiv, cursor = "normal.png", customStates = {}) {
        this.elements = elements;
        this.buildRootElement = buildRootElement;
        this.cursor = cursor;
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
function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
function randomCornerLocation() {
    let x = Math.random() * 50 + 50;
    x = Math.random() > 0.5 ? x : window.innerWidth - x;
    let y = Math.random() * 50 + 50;
    y = Math.random() > 0.5 ? y : window.innerHeight - y;
    return new Vector(x, y);
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
function stats() {
    var _a;
    if (document.getElementById("stats")) {
        document.getElementById("stats").remove();
        document.body.firstChild.style.display = "";
        return;
    }
    let statsTable = new GameElements.ElementCreator("table").toElement();
    let headRow = new GameElements.ElementCreator("tr").toElement();
    for (const text of ["Game mode", "Times played"]) {
        headRow.appendChild(new GameElements.ElementCreator("th").setText(text).toElement());
    }
    statsTable.appendChild(headRow);
    for (const gameMode of GameModes.availableModes) {
        let row = new GameElements.ElementCreator("tr").toElement();
        row.appendChild(new GameElements.ElementCreator("td").setText(gameMode.name).toElement());
        let gameCount = (_a = localStorage.getItem(gameMode.name)) !== null && _a !== void 0 ? _a : "0";
        row.appendChild(new GameElements.ElementCreator("td").setText(gameCount).toElement());
        statsTable.appendChild(row);
    }
    let stats = new GameElements.ElementCreator("div").setId("stats").toElement();
    stats.appendChild(statsTable);
    document.body.firstChild.style.display = "none";
    document.body.prepend(stats);
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
        class EndGameButton {
            constructor(text, message = "Congrats. For a second there I thought you wouldn't make it :)") {
                this.text = text;
                this.message = message;
            }
            render() {
                return new GameElements.ElementCreator("button")
                    .setText(this.text)
                    .setId("end-game-button")
                    .onClick(() => this.onClick())
                    .toElement();
            }
            onClick() {
                gameManager.changeGameMode(this.message);
            }
        }
        Buttons.EndGameButton = EndGameButton;
        class RunningButton {
            constructor() {
                this.text = "No";
            }
            render() {
                return new GameElements.ElementCreator("button")
                    .setId("running_btn")
                    .setText("No")
                    .toElement();
            }
        }
        Buttons.RunningButton = RunningButton;
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
                this.render = () => new GameElements.ElementCreator("h1")
                    .setId("headline")
                    .setText(this.text)
                    .toElement();
            }
        }
        Headlines.SimpleHeadline = SimpleHeadline;
    })(Headlines = GameElements.Headlines || (GameElements.Headlines = {}));
})(GameElements || (GameElements = {}));
