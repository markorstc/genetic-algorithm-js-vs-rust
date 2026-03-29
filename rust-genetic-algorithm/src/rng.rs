/// Lightweight pseudo-random number generator (xorshift32) seeded from getrandom.
/// This avoids pulling in the full `rand` crate.

use std::cell::Cell;

thread_local! {
    static RNG_STATE: Cell<u32> = Cell::new(0);
}

fn ensure_seeded() {
    RNG_STATE.with(|state| {
        if state.get() == 0 {
            let mut seed = [0u8; 4];
            getrandom::getrandom(&mut seed).expect("getrandom failed");
            let s = u32::from_le_bytes(seed);
            state.set(if s == 0 { 1 } else { s });
        }
    });
}

fn next_u32() -> u32 {
    ensure_seeded();
    RNG_STATE.with(|state| {
        let mut x = state.get();
        x ^= x << 13;
        x ^= x >> 17;
        x ^= x << 5;
        state.set(x);
        x
    })
}

/// Returns a random f32 in [0, 1)
pub fn rand_f32() -> f32 {
    (next_u32() >> 8) as f32 / (1u32 << 24) as f32
}

/// Returns a random usize in [0, n)
pub fn rand_usize(n: usize) -> usize {
    (next_u32() as usize) % n
}

/// Linear interpolation: a + t * (b - a)
pub fn lerp(a: f32, b: f32, t: f32) -> f32 {
    a + t * (b - a)
}
