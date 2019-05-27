
let walls = [];
let ray;
let particle;
let xoff = 0;
let yoff = 700;

function setup() {
	createCanvas(windowWidth, windowHeight);
	// createCanvas(400, 400);
	for (let i = 0; i < 5; i++){
		let x1 = random(width);
		let x2 = random(width);
		let y1 = random(height);
		let y2 = random(height);
		walls[i] = new Boundary(x1, y1, x2, y2);
	}
	// outer walls
	walls.push(new Boundary(0, 0, width, 0));
	walls.push(new Boundary(0, height, width, height));
	walls.push(new Boundary(0, 0, 0, height));
	walls.push(new Boundary(width, 0, width, height));
	wall = new Boundary(600, 100, 300, 300);
	particle = new Particle();
}

function draw() {
	background(0);
	for (let wall of walls) {
		wall.show();
	}
	particle.update(noise(xoff) * width, noise(xoff) * height);
	// xoff += random() / 100;
	// yoff += random() / 100;
	xoff += 0.01;
	yoff += 0.01;
	// wall.show();
	// particle.update(mouseX, mouseY);
	particle.show();
	particle.look(walls);
	// particle.look(wall);
	// ray.show();
	// ray.lookAt(mouseX, mouseY);
	// let pt = ray.cast(wall);
	// console.log(pt);
	// if(pt) {
	// 	fill(255);
	// 	ellipse(pt.x, pt.y, 8, 8);
	// }
}
