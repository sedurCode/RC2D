// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Neuro-Evolution steering

function nextGeneration(target) {
  console.log('next generation');
  calculateFitness(target);
  for (let i = 0; i < totalPopulation; i++) {
    population[i] = pickOne();
  }
  for (let i = 0; i < totalPopulation; i++){
    savedParticles[i].dispose();
  }
  savedParticles = [];
}

function pickOne() {
  let index = 0;
  let r = random(1);
  while (r > 0) {
    r = r - savedParticles[index].fitness;
    index++;
  }
  index--;
  // TODO implement copy particle
  let particle = savedParticles[index];
  let child = new Particle(particle.brain);
  child.mutate();
  return child;
}

function calculateFitness(target) {
  let sum = 0;
  for (let particle of savedParticles) {
    particle.calculateFitness(target);
    sum += particle.fitness;
  }
  // normalize fitness
  for (let particle of savedParticles) {
    particle.fitness = particle.fitness / sum;
  }
}
