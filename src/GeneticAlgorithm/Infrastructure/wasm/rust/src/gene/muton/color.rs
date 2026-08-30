use super::macros::impl_interval_muton;

#[derive(Clone, Copy, PartialEq, Eq)]
pub struct Color(u8);

impl_interval_muton!(Color, u8, 0, 255);
