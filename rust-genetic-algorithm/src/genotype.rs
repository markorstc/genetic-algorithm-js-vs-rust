use crate::gene::Gene;
use crate::renderer;

/// A genotype is a collection of genes (one per rectangle) plus a cached fitness score.
#[derive(Clone)]
pub struct Genotype {
    pub genes: Vec<Gene>,
    pub fitness: f32,
}

impl Genotype {
    /// Create a genotype with all genes in their JS-style initial state.
    pub fn initial(number_of_shapes: usize, canvas_width: u32, canvas_height: u32) -> Self {
        let genes = (0..number_of_shapes)
            .map(|_| Gene::initial(canvas_width, canvas_height, number_of_shapes))
            .collect();
        Genotype { genes, fitness: 0.0 }
    }

    /// Evaluate and cache fitness by rendering to a pixel buffer and comparing with the target.
    pub fn evaluate_fitness(&mut self, target_pixels: &[u8], width: u32, height: u32) {
        let rendered = renderer::render(&self.genes, width, height);
        self.fitness = similarity_percentage(&rendered, target_pixels, width, height);
    }

    /// Crossover: pair each gene with its counterpart in `other`.
    pub fn crossover(&self, other: &Genotype) -> Genotype {
        let genes = self
            .genes
            .iter()
            .zip(other.genes.iter())
            .map(|(a, b)| a.crossover(b))
            .collect();
        Genotype { genes, fitness: 0.0 }
    }

    /// Mutate: mutate each gene independently.
    pub fn mutate(&self) -> Genotype {
        let genes = self.genes.iter().map(|g| g.mutate()).collect();
        Genotype { genes, fitness: 0.0 }
    }

    /// Serialise genes to a flat u16 Vec compatible with `TransferableGenotype`.
    pub fn to_transferable(&self) -> Vec<u16> {
        let mut out = Vec::with_capacity(self.genes.len() * 11);
        for gene in &self.genes {
            out.extend_from_slice(&gene.to_u16_array());
        }
        out
    }
}

/// Matches `ImageSimilarityEvaluator.similarityPercentage()`.
fn similarity_percentage(rendered: &[u8], target: &[u8], width: u32, height: u32) -> f32 {
    let total_pixels = (width * height) as f32;
    let mut loss = 0.0f32;

    let len = rendered.len().min(target.len());
    let mut i = 0;
    while i + 3 < len {
        let r = (rendered[i] as i32 - target[i] as i32).unsigned_abs() as f32 / 255.0;
        let g = (rendered[i + 1] as i32 - target[i + 1] as i32).unsigned_abs() as f32 / 255.0;
        let b = (rendered[i + 2] as i32 - target[i + 2] as i32).unsigned_abs() as f32 / 255.0;
        // skip alpha [i+3] – matches JS
        loss += r + g + b;
        i += 4;
    }

    loss /= total_pixels * 3.0;
    (1.0 - loss) * 100.0
}
