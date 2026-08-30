use wasm_bindgen::prelude::wasm_bindgen;
//use wasm_rs_dbg::dbg; 

#[wasm_bindgen]
pub fn init_panic_hook() {
    // 1. MUST HAVE: Redirects standard Rust logs and crashes to the browser console
  //  console_error_panic_hook::set_once();
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "{ numberOfShapes: number; targetImageData: Uint8Array; canvasWidth: number; canvasHeight: number; }")]
    type Config;

    #[wasm_bindgen(method, getter, js_name = numberOfShapes)]
    fn number_of_shapes(this: &Config) -> u32;

    #[wasm_bindgen(method, getter, js_name = targetImageData)]
    fn target_image_data(this: &Config) -> Vec<u8>;

    #[wasm_bindgen(method, getter, js_name = canvasWidth)]
    fn canvas_width(this: &Config) -> u32;

    #[wasm_bindgen(method, getter, js_name = canvasHeight)]
    fn canvas_height(this: &Config) -> u32;
}

#[wasm_bindgen]
pub struct Population {
    targetImageData: Vec<u8>,
}

#[wasm_bindgen]
impl Population {
    #[wasm_bindgen(constructor)]
    pub fn new(cnf: Config) -> Self {
        Self { targetImageData: vec![1, 13] }
    }

    pub fn evolve(&mut self) {
        dbg!(&self.targetImageData);
    }

    //fn fittest(&self) -> Genome {

    //}
}
