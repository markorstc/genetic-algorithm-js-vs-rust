use wasm_bindgen::prelude::wasm_bindgen;

use crate::Genome;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "{ numberOfShapes: number; targetImageData: Uint8Array; canvasWidth: number; canvasHeight: number; }")]
    pub type Config;

    #[wasm_bindgen(method, getter, js_name = populationSize)]
    fn population_size(this: &Config) -> u16;

    #[wasm_bindgen(method, getter, js_name = numberOfShapes)]
    fn number_of_shapes(this: &Config) -> u16;

    #[wasm_bindgen(method, getter, js_name = targetImageData)]
    fn target_image_data(this: &Config) -> Vec<u8>;

    #[wasm_bindgen(method, getter, js_name = canvasWidth)]
    fn canvas_width(this: &Config) -> u16;

    #[wasm_bindgen(method, getter, js_name = canvasHeight)]
    fn canvas_height(this: &Config) -> u16;
}

#[wasm_bindgen]
pub struct Population(Vec<Genome>);

#[wasm_bindgen]
impl Population {
    #[wasm_bindgen(constructor)]
    pub fn new(cnf: Config) -> Self {
        Self {
            genomes: (0..cnf.population_size())
                .map(|_| Genome::new(cnf))
                .collect(),
        }
    }

    pub fn evolve(&mut self){
        log::debug!("kokot");
        log::debug!("targetImageData = {:?}", self.targetImageData);
    }

    //fn fittest(&self) -> Genome {
    //}
}
