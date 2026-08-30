use super::macros::impl_interval_muton;

#[derive(Clone, Copy, PartialEq, Eq)]
pub struct Angle(u16);

impl_interval_muton!(Angle, u16, 0, 360);
