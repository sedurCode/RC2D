class Boundary {
  constructor(x1, y1, x2, y2) {
    this.b = createVector(x1, y1);
    this.a = createVector(x2, y2);
  }
  midpoint(){
    return createVector((this.b.x + this.a.x) * 0.5, (this.b.y + this.a.y) * 0.5);
  }
  show(){
    stroke(255);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}
