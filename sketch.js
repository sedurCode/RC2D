const totalPopulation = 100;
let walls = [];
let ray;
// let particle;
let population = [];
let savedParticles = [];
let xoff = 0;
let yoff = 700;
const sceneW = 800;
const sceneH = 800;
let sliderFOV;
let speedSlider;
const LIFESPAN = 80;
const MUTATION_RATE = 0.5 ;
const MAX_SIGHT = 75;
const MAX_SPEED = 8;
const MAX_FORCE = 1.0;
const FOV = 90;
let inside = [];
let outside = [];
let checkpoints = [];
let start = [];
let end = [];
let startPoint = 0;

function buildTrack(){
	let noiseMax = 4;
	let trackSegments = 40;
	const pathWidth = 30;
	let startX = random(1000);
	let startY = random(1000);
	checkpoints = [];
	walls = [];
	inside = [];
	outside = [];
	start = [];
	end = [];
	for (let i = 0; i < trackSegments; i++) {
			let a = map(i, 0, trackSegments, 0, TWO_PI);
	  	let xoff = map(cos(a), -1, 1, 0, noiseMax) + startX;
	  	let yoff = map(sin(a), -1, 1, 0, noiseMax) + startY;
	  	let r = map(noise(xoff, yoff), 0, 1, 100, height / 2 + 50);
			let x = width/2 + r * cos(a);
	  	let y = height/2 + r * sin(a);
	  	let x1 = width/2 + (r - pathWidth) * cos(a);
	  	let y1 = height/2 + (r - pathWidth) * sin(a);
			let x2 = width/2 + (r + pathWidth) * cos(a);
	  	let y2 = height/2 + (r + pathWidth) * sin(a);
			checkpoints.push(new Boundary(x1, y1, x2, y2));
			inside.push(createVector(x1, y1));
			outside.push(createVector(x2, y2));
	  }
	for (let i = 0; i < checkpoints.length; i++){
		let a1 = inside[i];
		let b1 = inside[(i + 1) % checkpoints.length];
		walls.push(new Boundary(a1.x, a1.y, b1.x, b1.y));
		let a2 = outside[i];
		let b2 = outside[(i + 1) % checkpoints.length];
		walls.push(new Boundary(a2.x, a2.y, b2.x, b2.y));
	}
	let totalCheckpoints = checkpoints.length;
	walls.push(new Boundary(outside[totalCheckpoints-1].x, outside[totalCheckpoints-1].y, inside[totalCheckpoints-1].x, inside[totalCheckpoints-1].y));
	startPoint = ceil(random());
	start = checkpoints[0].midpoint();
	end = checkpoints[totalCheckpoints-2].midpoint();
}

function setup() {
	// createCanvas(windowWidth, windowHeight);
	createCanvas(sceneW, sceneH);
	// walls
	tf.setBackend('cpu');
	buildTrack();
	for (let i = 0; i < totalPopulation; i++){
		population[i] = new Particle();
	}
	speedSlider = createSlider(1, 10, 1);
}

function draw() {
	// draw
	// Set background to black
	background(0);
	// plot the walls
	for (let wall of walls) {
		wall.show();
	}
	// for (let check of checkpoints){
	// 	stroke(255, 100);
	// 	check.show();
	// }
	for (let particle of population)
	{
		// show the particles
		particle.show();
	}
	ellipse(start.x, start.y, 10)
	ellipse(end.x, end.y, 10);
	// handle sim speed
	const cycles = speedSlider.value();
	for (let n = 0; n < cycles; n++){
	// iterate through population
	for (let particle of population)
	{
		// Call the look
		particle.look(walls);
		// check nearness to end
		particle.check(checkpoints);
		// check bounds
		particle.bounds();
		// update the movement
		particle.update();
		// show the particles
		particle.show();
	}
	// reduce population
	for (let i = population.length-1; i >= 0; i--){
		const particle = population[i];
		if (particle.dead || particle.finished){
			savedParticles.push(population.splice(i, 1)[0]);
		}
	}
	if (population.length == 0){
		buildTrack();
		nextGeneration(end);
	}
}
	// // draw
	// // Set background to black
	// background(0);
	// // plot the walls
	// for (let wall of walls) {
	// 	wall.show();
	// }
	// // for (let check of checkpoints){
	// // 	stroke(255, 100);
	// // 	check.show();
	// // }
	// for (let particle of population)
	// {
	// 	// show the particles
	// 	particle.show();
	// }
	// ellipse(start.x, start.y, 10)
	// ellipse(end.x, end.y, 10);
}
