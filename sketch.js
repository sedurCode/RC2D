
let walls = [];
let ray;
let particle;
let xoff = 0;
let yoff = 700;
const sceneW = 400;
const sceneH = 400;
let sliderFOV;

function setup() {
	// createCanvas(windowWidth, windowHeight);
	createCanvas(800, 400);
	for (let i = 0; i < 5; i++){
		let x1 = random(sceneW);
		let x2 = random(sceneW);
		let y1 = random(sceneH);
		let y2 = random(sceneH);
		walls[i] = new Boundary(x1, y1, x2, y2);
	}
	// // outer walls
	walls.push(new Boundary(0, 0, sceneW, 0));
	walls.push(new Boundary(0, sceneH, sceneW, sceneH));
	walls.push(new Boundary(0, 0, 0, sceneH));
	walls.push(new Boundary(sceneW, 0, sceneW, sceneH));
	// wall = new Boundary(600, 100, 300, 300);
	particle = new Particle(sceneW / 2, sceneH / 2);
	sliderFOV = createSlider(5, 360, 45);
	sliderFOV.input(changeFOV);
}

function changeFOV() {
	const fov = sliderFOV.value();
	particle.updateFOV(fov);
}
// function keyPressed() {
// 	// console.log("key pressed")
// 	// console.log(key);
// 	if (key == 'A') {
// 		// console.log("A")
// 		particle.rotate(0.1);
// 	} else if (key == 'S') {
// 		particle.rotate(-0.1);
// 		// console.log("S")
// 	}
// }

function draw() {
	if (keyIsDown(LEFT_ARROW)) {
			particle.rotate(0.1);
	} else if (keyIsDown(RIGHT_ARROW)) {
			particle.rotate(-0.1);
	}

	if (keyIsDown(UP_ARROW)){
			particle.move(1);
	} else if(keyIsDown(DOWN_ARROW)){
			particle.move(-1);
	}
	background(0);
	for (let wall of walls) {
		wall.show();
	}
	// particle.update(mouseX, mouseY);
	// particle.update(noise(xoff) * sceneW, noise(xoff) * sceneH);
	particle.show();
	const scene = particle.look(walls);
	const w = sceneW / scene.length;
	push();
	translate(sceneW, 0)
	for (let i = 0; i < scene.length; i++) {
		noStroke();
		rectMode(CENTER);
		const sq = scene[i] * scene[i];
		const wSq = sceneW * sceneW;
		const b = map(sq, 0, wSq, 255, 0);
		const h = map(scene[i], 0, sceneW, sceneH, 0);
		fill(b)
		rect(i * w + w / 2, sceneH / 2, w + 1, h);
	}
	pop();
	// xoff += random() / 100;
	// yoff += random() / 100;
	// xoff += 0.01;
	// yoff += 0.01;
	// wall.show();
	// particle.update(mouseX, mouseY);
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
