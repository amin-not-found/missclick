class Vector {
  constructor(public x: number, public y: number) {}
  substract(vector: Vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }
  add(vector: Vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }
  divideScaler(scaler: number): Vector {
    return new Vector(this.x / scaler, this.y / scaler);
  }
  multiplyScaler(scaler: number): Vector {
    return new Vector(this.x * scaler, this.y * scaler);
  }
  length(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
  normalize(): Vector {
    return this.divideScaler(this.length());
  }
}
