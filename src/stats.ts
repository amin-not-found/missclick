function stats() {
  if (document.getElementById("stats")) {
    document.getElementById("stats")!.remove();
    (document.body.firstChild as HTMLElement).style.display = "";
    return;
  }

  let statsTable = new GameElements.ElementCreator("table").toElement();

  let headRow = new GameElements.ElementCreator("tr").toElement();
  for (const text of ["Game mode", "Times played"]) {
    headRow.appendChild(
      new GameElements.ElementCreator("th").setText(text).toElement()
    );
  }
  statsTable.appendChild(headRow);

  for (const gameMode of GameModes.availableModes) {
    let row = new GameElements.ElementCreator("tr").toElement();
    row.appendChild(
      new GameElements.ElementCreator("td").setText(gameMode.name).toElement()
    );
    let gameCount = localStorage.getItem(gameMode.name) ?? "0";
    row.appendChild(
      new GameElements.ElementCreator("td").setText(gameCount).toElement()
    );
    statsTable.appendChild(row);
  }

  let stats = new GameElements.ElementCreator("div").setId("stats").toElement();
  stats.appendChild(statsTable);
  (document.body.firstChild as HTMLElement).style.display = "none";
  document.body.prepend(stats);
}
