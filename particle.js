function pldistance(p1, p2, x, y){
  const num = abs((p2.y - p1.y) * x - (p2.x - p1.x) * y + p2.x * p1.y - p2.y * p1.x);
  const den = p5.Vector.dist(p1, p2);
  return num / den;
}

function getNormalPoint(p, a, b){
  //vector from a to p
  let ap = p5.Vector.sub(p, a);
  let ab = p5.Vector.sub(b, a);
  ab.normalize(); // normalize
  ab.mult(ap.dot(ab));
  let normalPoint = p5.Vector.add(a, ab);
  return normalPoint;
}

class Particle {
  constructor(brain){
    this.fitness = 0;
    this.dead = false;
    this.finished = false;
    this.pos = createVector(start.x, start.y);
    this.vel = createVector();
    this.acc = createVector();
    this.rays = [];
    this.heading = random();
    this.maxSpeed = MAX_SPEED;
    this.maxForce = MAX_FORCE;
    this.fov = FOV;
    this.counter = 0;
    // this.fov = 90;
    this.maxSight = MAX_SIGHT;
    this.targetCheckpoint = 2;
    for (let a = -this.fov/2; a < this.fov/2; a += 10) {
      this.rays.push(new Ray(this.pos, radians(a)));
    }
    if (brain){
      this.brain = brain.copy();
      // console.log("brain coppiedss")
    } else {
      this.brain = new NeuralNetwork(this.rays.length+2, this.rays.length+2, 2);
    }
  }
  mutate(){
    // console.log("starting mutation")
    this.brain.mutate(0.1);
    // console.log("muation complete")
  }
  dispose(){
    // this.brain.dispose();
    this.brain = [];
  }
  applyForce(force){
    this.acc.add(force);
  }
  update(){
    if (!this.dead && !this.finished){
      this.pos.add(this.vel);
      this.vel.add(this.acc);
      // this.vel.limit(this.maxSpeed)
      this.acc.set(0, 0);
      this.counter++;
      if (this.counter > LIFESPAN){
        this.dead = true;
      }
      for(let i = 0; i < this.rays.length; i++) {
        this.rays[i].rotate(this.vel.heading());
      }
    }
  }
  check(checkpoints){
    // for (let checkpoint of checkpoints){
    if (!this.finished){
    this.goal = checkpoints[this.targetCheckpoint];
    // const d = p5.Vector.dist(this.pos, goal.midpoint());
    const d = pldistance(this.goal.a, this.goal.b, this.pos.x, this.pos.y);
    if (d < 10 && this.targetCheckpoint == checkpoints.length-2){
      this.finished = true;
    } else if (d<5) {
      this.targetCheckpoint++;
      this.counter = 0;
    }
  }
    // }
    // const d = p5.Vector.dist(this.pos, target);
    // if (d<10){
    //   this.finished = true;
    // }
  }
  move(amt) {
    const vel = p5.Vector.fromAngle(this.heading);
    vel.setMag(amt);
    this.pos.add(vel)
  }
  updateFOV(fov){
    this.fov = fov;
    this.rays = [];
    for (let a = -this.fov/2; a < this.fov/2; a += 10) {
      this.rays.push(new Ray(this.pos, radians(a) + this.heading));
    }
  }
  rotate(angle) {
    this.heading += angle;
    let index = 0;
    for (let a = -this.fov/2; a < this.fov/2; a += 10) {
      this.rays[index].setAngle(radians(a) + this.heading);
      index++;
    }
  }
  calculateFitness(target){
    this.fitness = pow(2, this.targetCheckpoint);
    // if(this.finished){
    //   this.fitness = 1;
    // } else {
    //   const d = p5.Vector.dist(this.pos, target);
    //   this.fitness = constrain(1 / d, 0, 1);
    // }
  }
  look(walls){
    const scene = [];
        // for (let ray of this.rays){
    let inputs = [];
    for (let i = 0; i < this.rays.length; i++){
      const ray = this.rays[i];
      let closest = null;
      let record = this.maxSight;
      for (let wall of walls) {
        const pt = ray.cast(wall);
        if (pt) {
          let d = p5.Vector.dist(this.pos, pt)
          // const a = ray.dir.heading() - this.heading;
          // d *= cos(a);
          if (d < record && d < this.maxSight) {
            record = d;
            closest = pt;
          }
        }
      }
      inputs[i] = map(record, 0, 50, 1, 0);
      if (record < 5) {
        // console.log('hit wall')
        this.dead = true;
      }
      // if (closest){
      //   if (i == round(this.rays.length/2)){
      //     stroke('red');
      //     line(this.pos.x, this.pos.y, closest.x, closest.y);
      //   } else {
      //     stroke(255, 100);
      //     line(this.pos.x, this.pos.y, closest.x, closest.y);
      //   }
      // }
      scene[i] = record;
    }
    const vel = this.vel.copy();
    vel.normalize();
    inputs.push(vel.x);
    inputs.push(vel.y);
    const output = this.brain.predict(inputs);
    // const angle = map(output[0], 0, 1, 0, TWO_PI);
    // const steering = p5.Vector.fromAngle(angle);
    let angle = map(output[0], 0, 1, -PI, TWO_PI);
    angle += this.vel.heading();
    const steering = p5.Vector.fromAngle(angle);
    let targSpeed = map(output[1], 0, 1, 0, MAX_SPEED);
    // steering.setMag(this.maxSpeed);
    steering.setMag(targSpeed);
    steering.sub(this.vel);
    steering.limit(this.maxForce);
    this.applyForce(steering);
    // console.log(output);
    // return scene;
  }
  bounds(){
    if (this.pos.x > sceneW || this.pos.x < 0 || this.pos.y > sceneH || this.pos.y < 0){
      this.dead = true;
    }
  }
  show(){
    push();
    translate(this.pos.x, this.pos.y);
    const heading = this.vel.heading();
    rotate(heading);
    fill(255, 100);
    // ellipse(this.pos.x, this.pos.y, 10);
    rectMode(CENTER);
    rect(0, 0, 10, 5);
    pop();
    // for (let ray of this.rays){
    //   ray.show();
    // }
    if (this.goal){
      stroke(255);
      this.goal.show();
    }

  }
}
