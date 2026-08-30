use crate::GeneticOperator;

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum Shape {
    Rectangle,
    Circle,
}

impl GeneticOperator for Shape {
    fn crossover(&self, other: &Self) -> Self {
        self.clone()
    }

    fn mutate(&mut self) {}
}

impl From<Shape> for u16 {
    fn from(value: Shape) -> Self {
        value as u16
    }
}
