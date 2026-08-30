use super::macros::impl_interval_muton;

#[derive(Clone, Copy, PartialEq, Eq)]
pub struct ZIndex(u8);

impl_interval_muton!(ZIndex, u8, 0, 10);
