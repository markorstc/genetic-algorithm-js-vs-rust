use wasm_bindgen::prelude::wasm_bindgen;

mod population;
mod gene;

use crate::gene::muton::{Color, Opacity, Shape};

#[wasm_bindgen]
pub fn init_panic_hook() {
    let _ = console_log::init_with_level(log::Level::Debug);
    console_error_panic_hook::set_once();
    log::debug!("wasm debug logging initialized");
}

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

//struct Gene(Color, Color, Color, Opacity, Shape, HorizontalDistance, VerticalDistance, ZIndex, HorizontalDistance, VerticalDistance, Angle);

struct Gene(Color, Color, Color, Opacity, Shape);

trait GeneticOperator {
    fn crossover(&self, other: &Self) -> Self;
    fn mutate(&mut self);
}

#[wasm_bindgen]
#[derive(Default)]
pub struct Genome {
    buffer: Vec<u16>,
}

#[wasm_bindgen]
impl Genome {
    #[wasm_bindgen(constructor)]
    pub fn new(cnf: Config) -> Self {
        let mut genome = Self::default();
        genome.add_gene(Gene(
            111.try_into().unwrap(),
            Color::try_from(112).map(|mut c| { c.mutate(); c }).unwrap(),
            Color::try_from(113).unwrap(),
            Opacity::try_from(20).unwrap(),
            Shape::Rectangle,
        ));
        genome.add_gene(Gene(
            Color::try_from(121).unwrap(),
            Color::try_from(122).unwrap().crossover(&Color::try_from(130).unwrap()),
            Color::try_from(123).unwrap(),
            Opacity::try_from(30).unwrap(),
            Shape::Circle,
        ));
        genome
    }

    #[wasm_bindgen(getter)]
    pub fn ptr(&self) -> *const u16 {
        self.buffer.as_ptr()
    }

    #[wasm_bindgen(getter)]
    pub fn len(&self) -> usize {
        self.buffer.len()
    }

    fn add_gene(&mut self, Gene(r, g, b, a, shape): Gene) {
        self.buffer.push(r.into());
        self.buffer.push(g.into());
        self.buffer.push(b.into());
        self.buffer.push(a.into());
        self.buffer.push(shape.into());
        //same but with extend
    }
}
