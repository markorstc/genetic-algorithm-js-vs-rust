mod gene;
mod genotype;
mod population;
mod renderer;
mod rng;

use std::cell::RefCell;
use wasm_bindgen::prelude::*;

thread_local! {
    static POPULATION: RefCell<Option<population::Population>> = RefCell::new(None);
}

/// Initialize a new population with the given configuration.
/// target_pixels: raw RGBA pixel data of the target image (width * height * 4 bytes)
#[wasm_bindgen]
pub fn init_population(
    number_of_shapes: u32,
    canvas_width: u32,
    canvas_height: u32,
    target_pixels: Vec<u8>,
    population_size: u32,
) {
    let pop = population::Population::new(
        number_of_shapes as usize,
        canvas_width,
        canvas_height,
        target_pixels,
        population_size as usize,
    );
    POPULATION.with(|p| *p.borrow_mut() = Some(pop));
}

/// Evolve the population by one generation and return the best genotype as a flat u16 array.
/// The array contains `number_of_shapes * 11` values, each gene has:
///   [r, g, b, a, shape, x, y, z, width, height, rotation]
/// This matches the TransferableGene (Uint16Array) format used by the JS implementation.
#[wasm_bindgen]
pub fn evolve_and_get_fittest() -> Vec<u16> {
    POPULATION.with(|p| {
        let mut pop_ref = p.borrow_mut();
        let pop = pop_ref.as_mut().expect("Population must be initialized before evolving");
        pop.evolve();
        pop.get_fittest()
    })
}

/// Return the fitness score of the current best individual (0-100).
#[wasm_bindgen]
pub fn get_best_fitness() -> f32 {
    POPULATION.with(|p| {
        let pop_ref = p.borrow();
        match pop_ref.as_ref() {
            Some(pop) => pop.best_fitness(),
            None => 0.0,
        }
    })
}
