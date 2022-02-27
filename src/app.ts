var gameManager: GameManager;

window.onload = function () {
    gameManager = new GameManager();
    gameManager.renderGame()
    // I'm using an arrow function because it's an easy way to preserve gameManger's context
    window.onmousemove = (event) => gameManager.gameMode.mouseUpdate(event)
    window.onclick = function (event) {
        document.getElementById("cursor")?.remove()
        let element = document.elementFromPoint(event.pageX, event.pageY) as HTMLElement;
        element?.click();
    }
}