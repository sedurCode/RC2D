class Particle {
  constructor(x, y){
    this.pos = createVector(x, y);
    this.rays = [];
    this.heading = 0;
    this.fov = 45;
    for (let a = -this.fov/2; a < this.fov/2; a += 1) {
      this.rays.push(new Ray(this.pos, radians(a)));
    }
  }
  update(x, y){
    this.pos.set(x, y);
  }
  move(amt) {
    const vel = p5.Vector.fromAngle(this.heading);
    vel.setMag(amt);
    this.pos.add(vel)
  }
  updateFOV(fov){
    this.fov = fov;
    this.rays = [];
    for (let a = -this.fov/2; a < this.fov/2; a += 1) {
      this.rays.push(new Ray(this.pos, radians(a) + this.heading));
    }
  }
  rotate(angle) {
    this.heading += angle;
    let index = 0;
    for (let a = -this.fov/2; a < this.fov/2; a += 1) {
      this.rays[index].setAngle(radians(a) + this.heading);
      index++;
    }
  }
  look(walls){
    const scene = [];
        // for (let ray of this.rays){
    for (let i = 0; i < this.rays.length; i++){
      const ray = this.rays[i];
      let closest = null;
      let record = Infinity;
      for (let wall of walls) {
        const pt = ray.cast(wall);
        if (pt) {
          let d = p5.Vector.dist(this.pos, pt)
          const a = ray.dir.heading() - this.heading;
          d *= cos(a);
          if (d < record) {
            record = d;
            closest = pt;
          }
        }
      }
      if (closest){
        stroke(255, 100);
        line(this.pos.x, this.pos.y, closest.x, closest.y);
      }
      scene[i] = record;
    }
    return scene;
  }
  show(){
    fill(255);
    ellipse(this.pos.x, this.pos.y, 4);
    // for (let ray of this.rays){
    //   ray.show();
    // }
  }
}
