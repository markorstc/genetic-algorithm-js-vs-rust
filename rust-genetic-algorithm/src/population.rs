use crate::genotype::Genotype;
use crate::rng::{rand_f32, rand_usize};

pub struct Population {
    pub individuals: Vec<Genotype>,
    canvas_width: u32,
    canvas_height: u32,
    target_pixels: Vec<u8>,
}

impl Population {
    pub fn new(
        number_of_shapes: usize,
        canvas_width: u32,
        canvas_height: u32,
        target_pixels: Vec<u8>,
        size: usize,
    ) -> Self {
        let individuals = (0..size)
            .map(|_| Genotype::initial(number_of_shapes, canvas_width, canvas_height))
            .collect();

        Population {
            individuals,
            canvas_width,
            canvas_height,
            target_pixels,
        }
    }

    /// Evolve the population by one generation.
    /// Mirrors `Population.evolve()` in JS:
    ///   - Evaluate fitness for everyone
    ///   - Sort descending by fitness
    ///   - Keep top 5% unchanged (immortals)
    ///   - Fill rest by crossing top-33% × full-population
    ///   - Apply mutation with 20% probability per offspring
    pub fn evolve(&mut self) {
        let cw = self.canvas_width;
        let ch = self.canvas_height;
        let target = &self.target_pixels;

        // Evaluate fitness
        for individual in &mut self.individuals {
            individual.evaluate_fitness(target, cw, ch);
        }

        // Sort descending (best first)
        self.individuals
            .sort_by(|a, b| b.fitness.partial_cmp(&a.fitness).unwrap_or(std::cmp::Ordering::Equal));

        let pop_len = self.individuals.len();
        let top_count = ((pop_len as f32 * 0.33).ceil() as usize).max(1);
        let immortal_count = ((pop_len as f32 * 0.05).ceil() as usize).max(1);

        let mut new_pop: Vec<Genotype> = Vec::with_capacity(pop_len);

        // Preserve immortals unchanged
        for i in 0..immortal_count.min(pop_len) {
            new_pop.push(self.individuals[i].clone());
        }

        // Breed the rest
        while new_pop.len() < pop_len {
            let parent_a = &self.individuals[rand_usize(top_count)];
            let parent_b = &self.individuals[rand_usize(pop_len)];

            let mut child = parent_a.crossover(parent_b);

            if rand_f32() < 0.20 {
                child = child.mutate();
            }

            new_pop.push(child);
        }

        self.individuals = new_pop;
    }

    /// Return the best individual's genes as a flat u16 array.
    /// Assumes the population is sorted (call `evolve()` first).
    pub fn get_fittest(&self) -> Vec<u16> {
        self.individuals
            .first()
            .map(|g| g.to_transferable())
            .unwrap_or_default()
    }

    /// Return the fitness of the current best individual.
    pub fn best_fitness(&self) -> f32 {
        self.individuals
            .first()
            .map(|g| g.fitness)
            .unwrap_or(0.0)
    }
}
