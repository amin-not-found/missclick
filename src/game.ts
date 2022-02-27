


class GameManager {
    readonly gameMode =  new StupidGame(this.renderGame);

    renderGame() {
        document.getElementById("game")?.remove();
        document.body.appendChild(this.gameMode.state.render());
    }
}