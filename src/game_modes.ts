interface GameMode {
    readonly state: GameState;
    mouseUpdate(event: MouseEvent): void;
    readonly cursor: String;

}


class StupidGame implements GameMode {
    private _state: GameState;
    constructor(
        public renderGame: Function
    ){
        let gameElements=[
            new StupidHeadline(),
            new ImStupidButton(),
             new RunningButton()
        ]
        this._state = new GameState(gameElements, emptyBackground,"normal.png");
    }

    
    get state(): GameState{ return this._state}
    get cursor(): String{ return this._state.cursor}

    mouseUpdate(event: MouseEvent): void {
        document.getElementById("cursor")?.remove();
        let cursor = document.createElement("img");
        cursor.id = "cursor";
        cursor.src = "assets/cursors/" + this.state.cursor;
        cursor.style.left = event.pageX+"px";
        cursor.style.top = event.pageY+"px";
        document.body.appendChild(cursor);
    }
}