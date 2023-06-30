namespace GameModes {
    export interface IGameMode {
        readonly state: GameState;
        setupEvents(): void;
        canWin(): boolean;
        cleanup(): void;
    }

    export let availableModes: GameModeRepresentor[] = [];
    type Constructor<T> = {
        new(...args: any[]): T;
        readonly prototype: T;
    };
    export class GameModeRepresentor {
        constructor(
            public name: string,
            public probability: number,
            public classConstructor: Constructor<IGameMode>
        ) { }
    }
    export function listGameMode(name: string, probability: number) {
        return function <T extends Constructor<IGameMode>>(target: T) {
            let mode = new GameModeRepresentor(name, probability, target);
            availableModes.push(mode);
        };
    }

    export class GameMode implements IGameMode {
        protected _state: GameState;
        elements: GameElements.IGameElement[];
        onclick: (e: MouseEvent) => void;
        onmousemove: (e: MouseEvent) => void;

        constructor(gameElements: GameElements.IGameElement[]) {
            this.elements = gameElements;
            this._state = new GameState(gameElements);
            this.onclick = (e: MouseEvent) => gameManager.onClick(e);
            this.onmousemove = (e: MouseEvent) => {
                if (!document.pointerLockElement) return;
                this.updateMousePos(e);
                this.updateMouse();
            }
        }

        get state(): GameState {
            return this._state;
        }

        updateMousePos(event: MouseEvent, xRatio = 1, yRatio = 1) {
            this._state.cursorPos.x += event.movementX * xRatio;
            this._state.cursorPos.y += event.movementY * yRatio;

            if (this.state.cursorPos.x >= window.innerWidth) {
                this._state.cursorPos.x -= window.innerWidth;
            } else if (this.state.cursorPos.x < 0) {
                this._state.cursorPos.x += window.innerWidth;
            }
            if (this.state.cursorPos.y >= window.innerHeight) {
                this._state.cursorPos.y -= window.innerHeight;
            } else if (this.state.cursorPos.y < 0) {
                this._state.cursorPos.y += window.innerHeight;
            }
        }

        updateMouse() {
            document.getElementById("cursor")?.remove();
            let cursor = document.createElement("img");
            cursor.id = "cursor";
            cursor.src = "assets/cursors/" + this.state.cursor;
            cursor.style.left = this._state.cursorPos.x + "px";
            cursor.style.top = this._state.cursorPos.y + "px";
            document.body.appendChild(cursor);
        }

        setupEvents() {
            window.onclick = this.onclick;
            window.onmousemove = this.onmousemove;
        }
        // Default behaviour for games that have a game with EndGame button
        canWin() {
            let elementUnderCursor = document.elementFromPoint(
                this._state.cursorPos.x,
                this._state.cursorPos.y
            );
            if (elementUnderCursor?.id === "end-game-button") {
                return true;
            }
            return false;
        }
        
        cleanup(): void {
            document.getElementById(this._state.rootElementID)?.remove();
        }
    }
}
