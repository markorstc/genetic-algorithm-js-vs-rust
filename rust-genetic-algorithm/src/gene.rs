use crate::rng::{lerp, rand_f32};

/// A single gene represents one rectangle with all its properties.
/// The 11 values match the JS Mutons tuple:
///   [r, g, b, a, shape, x, y, z, width, height, rotation]
#[derive(Clone)]
pub struct Gene {
    pub r: f32,        // 0–255
    pub g: f32,        // 0–255
    pub b: f32,        // 0–255
    pub a: f32,        // 0–100 (opacity percentage)
    pub shape: f32,    // 0 = Rectangle (fixed, no mutation)
    pub x: f32,        // 0–canvas_width
    pub y: f32,        // 0–canvas_height
    pub z: f32,        // 0–number_of_shapes
    pub width: f32,    // 0–canvas_width (initialised at 1)
    pub height: f32,   // 0–canvas_height (initialised at 1)
    pub rotation: f32, // 0–360

    // Bounds used during mutation (mirrors IntervalMuton's minMax)
    pub canvas_width: f32,
    pub canvas_height: f32,
    pub number_of_shapes: f32,
}

impl Gene {
    /// Create a fresh gene matching the JS `createGenes` initialisation:
    ///   r=255, g=255, b=255, a=100, shape=0, x=cw/2, y=ch/2, z=0, w=1, h=1, rot=0
    pub fn initial(canvas_width: u32, canvas_height: u32, number_of_shapes: usize) -> Self {
        let cw = canvas_width as f32;
        let ch = canvas_height as f32;
        let ns = number_of_shapes as f32;
        Gene {
            r: 255.0,
            g: 255.0,
            b: 255.0,
            a: 100.0,
            shape: 0.0,
            x: cw / 2.0,
            y: ch / 2.0,
            z: 0.0,
            width: 1.0,
            height: 1.0,
            rotation: 0.0,
            canvas_width: cw,
            canvas_height: ch,
            number_of_shapes: ns,
        }
    }

    /// Crossover: lerp each muton between self and other using a random interpolant.
    pub fn crossover(&self, other: &Gene) -> Gene {
        Gene {
            r: lerp(self.r, other.r, rand_f32()),
            g: lerp(self.g, other.g, rand_f32()),
            b: lerp(self.b, other.b, rand_f32()),
            a: lerp(self.a, other.a, rand_f32()),
            shape: self.shape, // shape is fixed (no crossover in JS)
            x: lerp(self.x, other.x, rand_f32()),
            y: lerp(self.y, other.y, rand_f32()),
            z: lerp(self.z, other.z, rand_f32()),
            width: lerp(self.width, other.width, rand_f32()),
            height: lerp(self.height, other.height, rand_f32()),
            rotation: lerp(self.rotation, other.rotation, rand_f32()),
            canvas_width: self.canvas_width,
            canvas_height: self.canvas_height,
            number_of_shapes: self.number_of_shapes,
        }
    }

    /// Mutate: each muton has a 25% chance of being mutated (matching JS Gene.mutate).
    pub fn mutate(&self) -> Gene {
        Gene {
            r: if rand_f32() < 0.25 { mutate_interval(self.r, 0.0, 255.0) } else { self.r },
            g: if rand_f32() < 0.25 { mutate_interval(self.g, 0.0, 255.0) } else { self.g },
            b: if rand_f32() < 0.25 { mutate_interval(self.b, 0.0, 255.0) } else { self.b },
            a: if rand_f32() < 0.25 { mutate_interval(self.a, 0.0, 100.0) } else { self.a },
            shape: self.shape,
            x: if rand_f32() < 0.25 { mutate_interval(self.x, 0.0, self.canvas_width) } else { self.x },
            y: if rand_f32() < 0.25 { mutate_interval(self.y, 0.0, self.canvas_height) } else { self.y },
            z: if rand_f32() < 0.25 { mutate_interval(self.z, 0.0, self.number_of_shapes) } else { self.z },
            width: if rand_f32() < 0.25 { mutate_interval(self.width, 0.0, self.canvas_width) } else { self.width },
            height: if rand_f32() < 0.25 { mutate_interval(self.height, 0.0, self.canvas_height) } else { self.height },
            rotation: if rand_f32() < 0.25 { mutate_interval(self.rotation, 0.0, 360.0) } else { self.rotation },
            canvas_width: self.canvas_width,
            canvas_height: self.canvas_height,
            number_of_shapes: self.number_of_shapes,
        }
    }

    /// Serialise to a 11-element u16 array matching `TransferableGene` (Uint16Array).
    pub fn to_u16_array(&self) -> [u16; 11] {
        [
            self.r.round() as u16,
            self.g.round() as u16,
            self.b.round() as u16,
            self.a.round() as u16,
            self.shape.round() as u16,
            self.x.round() as u16,
            self.y.round() as u16,
            self.z.round() as u16,
            self.width.round() as u16,
            self.height.round() as u16,
            self.rotation.round() as u16,
        ]
    }
}

/// Matches `IntervalMuton.mutate()`:
///   randomValue = lerp(min, max, rand)
///   mutatedValue = lerp(randomValue, current, rand)
fn mutate_interval(current: f32, min: f32, max: f32) -> f32 {
    let random_val = lerp(min, max, rand_f32());
    lerp(random_val, current, rand_f32())
}
