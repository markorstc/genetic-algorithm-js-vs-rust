use num_traits::NumCast;

use crate::GeneticOperator;

mod angle;
mod color;
mod dimension;
mod opacity;
mod shape;
mod zindex;

pub use angle::Angle;
pub use color::Color;
pub use dimension::Dimension;
pub use opacity::Opacity;
pub use shape::Shape;
pub use zindex::ZIndex;

trait IntervalMuton {
    type Num: NumCast + Copy + PartialOrd;

    fn min(&self) -> Self::Num;
    fn max(&self) -> Self::Num;
    fn val(&self) -> Self::Num;
    unsafe fn with_val_unchecked(&self, value: Self::Num) -> Self;

    fn is_valid(&self, value: Self::Num) -> bool {
        value >= self.min() && value <= self.max()
    }
}

impl<T> GeneticOperator for T
where
    T: IntervalMuton + PartialEq + Clone,
{
    fn crossover(&self, other: &Self) -> Self {
        if self == other {
            return self.clone();
        }

        let val_a = self.val();
        let val_b = other.val();

        let mixed_val = lerp(val_a, val_b, fastrand::f64()).unwrap_or(val_a);

        unsafe { self.with_val_unchecked(mixed_val) }
    }

    fn mutate(&mut self) {
        let min_val = self.min();
        let max_val = self.max();

        let random_val = lerp(min_val, max_val, fastrand::f64()).unwrap_or(max_val);
        let current_val = self.val();

        if random_val == current_val {
            return;
        }

        let mixed_val = lerp(random_val, current_val, fastrand::f64()).unwrap_or(random_val);

        *self = unsafe { self.with_val_unchecked(mixed_val) }
    }
}

fn lerp<T: NumCast>(start: T, stop: T, t: f64) -> Option<T> {
    let a = start.to_f64()?;
    let b = stop.to_f64()?;

    let result = t * (b - a) + a;

    T::from(result)
}

mod macros {
    macro_rules! impl_interval_muton {
        ($muton_type:ty, $num_type:ty, $min:expr, $max:expr) => {
            impl super::IntervalMuton for $muton_type {
                type Num = $num_type;

                fn min(&self) -> Self::Num {
                    $min
                }
                fn max(&self) -> Self::Num {
                    $max
                }
                fn val(&self) -> Self::Num {
                    self.0
                }

                unsafe fn with_val_unchecked(&self, value: Self::Num) -> Self {
                    Self(value)
                }
            }

            impl TryFrom<$num_type> for $muton_type {
                type Error = &'static str;

                fn try_from(value: $num_type) -> Result<Self, Self::Error> {
                    let muton = Self(value);

                    if <Self as super::IntervalMuton::is_valid(&muton, value) {
                        Ok(muton)
                    } else {
                        Err("Out of bounds.")
                    }
                }
            }

            impl From<$muton_type> for u16 {
                fn from(muton: $muton_type) -> Self {
                    muton.0.into()
                }
            }
        };

        ($muton_type:ty, $num_type:ty, $min:expr) => {
            impl super::IntervalMuton for $muton_type {
                type Num = $num_type;

                fn min(&self) -> Self::Num {
                    $min
                }
                fn max(&self) -> Self::Num {
                    self.max
                }
                fn val(&self) -> Self::Num {
                    self.value
                }

                unsafe fn with_val_unchecked(&self, value: Self::Num) -> Self {
                    Self {
                        value,
                        max: self.max(),
                    }
                }
            }

            type BoundedValue = ($num_type, $num_type);

            impl TryFrom<BoundedValue> for $muton_type {
                type Error = &'static str;

                fn try_from((value, max): BoundedValue) -> Result<Self, Self::Error> {
                    let muton = Self { value, max };

                    if <Self as super::IntervalMuton>::is_valid(&muton, value) {
                        Ok(muton)
                    } else {
                        Err("Out of bounds.")
                    }
                }
            }

            impl From<$muton_type> for u16 {
                fn from(muton: $muton_type) -> Self {
                    muton.value.into()
                }
            }
        };
    }

    pub(crate) use impl_interval_muton;
}
