use super::macros::impl_interval_muton;

#[derive(Clone, Copy, PartialEq, Eq)]
pub struct Dimension {
    value: u16,
    max: u16,
}

impl_interval_muton!(Dimension, u16, 0);
