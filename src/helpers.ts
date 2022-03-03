function randomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randomCornerLocation(): Vector {
  let x = Math.random() * 50 + 50;
  x = Math.random() > 0.5 ? x : window.innerWidth - x;
  let y = Math.random() * 50 + 50;
  y = Math.random() > 0.5 ? y : window.innerHeight - y;

  return new Vector(x, y);
}
