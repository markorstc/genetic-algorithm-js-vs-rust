use super::macros::impl_interval_muton;

#[derive(Clone, Copy, PartialEq, Eq)]
pub struct Opacity(u8);

impl_interval_muton!(Opacity, u8, 0, 100);
