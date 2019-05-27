const totalPopulation = 50;
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
const MUTATION_RATE = 0.05;
const inside = [];
const outside = [];
const checkpoints = [];

function setup() {
	// createCanvas(windowWidth, windowHeight);
	createCanvas(sceneW, sceneH);
	// walls
	tf.setBackend('cpu');
	let noiseMax = 2;
	let trackSegments = 30;
	for (let i = 0; i < trackSegments; i++) {
			let a = map(i, 0, trackSegments, 0, TWO_PI);
	  	let xoff = map(cos(a), -1, 1, 0, noiseMax);
	  	let yoff = map(sin(a), -1, 1, 0, noiseMax);
	  	let r = map(noise(xoff, yoff), 0, 1, 100, height / 2 + 50);
			let x = width/2 + r * cos(a);
	  	let y = height/2 + r * sin(a);
	  	let x1 = width/2 + (r - 50) * cos(a);
	  	let y1 = height/2 + (r - 50) * sin(a);
			let x2 = width/2 + (r + 50) * cos(a);
	  	let y2 = height/2 + (r + 50) * sin(a);
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
	start = checkpoints[0];
	end = checkpoints[totalCheckpoints-2];
	for (let i = 0; i < totalPopulation; i++){
		population[i] = new Particle();
	}
	speedSlider = createSlider(1, 10, 1);
}

function draw() {
	// handle sim speed
	const cycles = speedSlider.value();
	for (let n = 0; n < cycles; n++){
	// iterate through population
	for (let particle of population)
	{
		// Call the look
		particle.look(walls);
		// check nearness to end
		particle.check(end);
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
		nextGeneration(end);
	}
}
	// draw
	// Set background to black
	background(0);
	// plot the walls
	for (let wall of walls) {
		wall.show();
	}
	for (let check of checkpoints){
		check.show();
	}
	for (let particle of population)
	{
		// show the particles
		particle.show();
	}
	ellipse(start.x, start.y, 10)
	ellipse(end.x, end.y, 10);
}
