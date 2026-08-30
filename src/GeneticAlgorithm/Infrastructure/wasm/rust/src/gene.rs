pub mod muton;

use crate::GeneticOperator;
use self::muton::{Angle, Color, Dimension, Opacity, Shape, ZIndex};

pub struct Gene {
    r: Color,
    g: Color,
    b: Color,
    a: Opacity,
    shape: Shape,
    x: Dimension,
    y: Dimension,
    z: ZIndex,
    width: Dimension,
    height: Dimension,
    rotation: Angle,
}

pub struct Genome(Vec<Gene>);

impl GeneticOperator for Gene {
    fn crossover(&self, other: &Self) -> Self {
        Self {
            r: self.r.crossover(&other.r),
            g: self.g.crossover(&other.g),
            b: self.b.crossover(&other.b),
            a: self.a.crossover(&other.a),
            shape: self.shape.crossover(&other.shape),
            x: self.x.crossover(&other.x),
            y: self.y.crossover(&other.y),
            z: self.z.crossover(&other.z),
            width: self.width.crossover(&other.width),
            height: self.height.crossover(&other.height),
            rotation: self.rotation.crossover(&other.rotation),
        }
    }

    fn mutate(&mut self) {
        self.r.mutate();
        self.g.mutate();
        self.b.mutate();
        self.a.mutate();
        self.shape.mutate();
        self.x.mutate();
        self.y.mutate();
        self.z.mutate();
        self.width.mutate();
        self.height.mutate();
        self.rotation.mutate();
    }
}

impl GeneticOperator for Genome {
    fn crossover(&self, other: &Self) -> Self {
        let genes = self.0.iter()
            .zip(&other.0)
            .map(|(gene_a, gene_b)| gene_a.crossover(gene_b))
            .collect();

        Self(genes)
    }

    fn mutate(&mut self) {
        for gene in &mut self.0 {
            gene.mutate();
        }
    }
}
