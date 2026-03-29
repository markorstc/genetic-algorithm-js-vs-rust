use crate::gene::Gene;
use core::f32::consts::PI;

/// Render a list of genes to an RGBA pixel buffer (width × height × 4 bytes).
///
/// Rendering matches the JS `CanvasRenderer.renderGene` logic:
///  - Sort genes by z-index (higher z value = painted later = on top)
///  - Each gene is a filled rectangle centred at (x, y), rotated by `rotation` degrees
///  - Colour is `rgb(r, g, b)` at `a%` opacity
///  - The rectangle top-left in JS is (y - height/2, x - width/2) — the axes look swapped
///    because JS `calcTopLeft` returns `[y - h/2, x - w/2]` and passes them as
///    `fillRect(top, left, width, height)`.  We replicate this exact behaviour.
///  - Alpha compositing uses standard "source-over".
pub fn render(genes: &[Gene], canvas_width: u32, canvas_height: u32) -> Vec<u8> {
    // RGBA buffer, transparent black background
    let size = (canvas_width * canvas_height * 4) as usize;
    let mut buffer = vec![0u8; size];

    // Sort by z-index ascending (lower z = painted first = underneath)
    let mut order: Vec<usize> = (0..genes.len()).collect();
    order.sort_by(|&a, &b| genes[a].z.partial_cmp(&genes[b].z).unwrap_or(std::cmp::Ordering::Equal));

    for idx in order {
        render_gene(&genes[idx], canvas_width, canvas_height, &mut buffer);
    }

    buffer
}

fn render_gene(gene: &Gene, cw: u32, ch: u32, buf: &mut [u8]) {
    let cx = gene.x;       // rotation / centre point x
    let cy = gene.y;       // rotation / centre point y
    let w = gene.width;
    let h = gene.height;
    let angle_rad = gene.rotation * PI / 180.0;
    let cos_a = angle_rad.cos();
    let sin_a = angle_rad.sin();

    // Alpha as a fraction 0–1 (gene.a is 0–100 percent)
    let src_alpha = gene.a / 100.0;
    let src_r = gene.r;
    let src_g = gene.g;
    let src_b = gene.b;

    // JS calcTopLeft returns [y - h/2, x - w/2], then calls fillRect(top, left, w, h).
    // fillRect(x_canvas, y_canvas, w, h) so:
    //   rect_x_start = y - h/2,   rect_x_end = y + h/2
    //   rect_y_start = x - w/2,   rect_y_end = x + w/2
    // width in canvas-x direction = h,  height in canvas-y direction = w
    // We replicate this axis swap exactly.
    let rect_x_min = cy - h / 2.0;
    let rect_y_min = cx - w / 2.0;
    let rect_x_max = rect_x_min + h;
    let rect_y_max = rect_y_min + w;

    // Compute the corners of the (possibly rotated) rectangle in canvas space.
    // Centre of rotation in JS: the translate + rotate + translate-back uses (cx, cy)
    // as the pivot, but the rect is drawn at (y-h/2, x-w/2).
    // The effective pivot in canvas coords: (cx, cy).
    let corners_local = [
        (rect_x_min - cx, rect_y_min - cy),
        (rect_x_max - cx, rect_y_min - cy),
        (rect_x_min - cx, rect_y_max - cy),
        (rect_x_max - cx, rect_y_max - cy),
    ];

    let rotated_corners: Vec<(f32, f32)> = corners_local
        .iter()
        .map(|&(lx, ly)| {
            let rx = lx * cos_a - ly * sin_a + cx;
            let ry = lx * sin_a + ly * cos_a + cy;
            (rx, ry)
        })
        .collect();

    // AABB of the rotated rectangle for iteration bounds
    let min_x = rotated_corners
        .iter()
        .map(|&(x, _)| x)
        .fold(f32::INFINITY, f32::min)
        .max(0.0) as u32;
    let max_x = rotated_corners
        .iter()
        .map(|&(x, _)| x)
        .fold(f32::NEG_INFINITY, f32::max)
        .min(cw as f32 - 1.0) as u32;
    let min_y = rotated_corners
        .iter()
        .map(|&(_, y)| y)
        .fold(f32::INFINITY, f32::min)
        .max(0.0) as u32;
    let max_y = rotated_corners
        .iter()
        .map(|&(_, y)| y)
        .fold(f32::NEG_INFINITY, f32::max)
        .min(ch as f32 - 1.0) as u32;

    if min_x > max_x || min_y > max_y {
        return;
    }

    let half_w = (rect_x_max - rect_x_min) / 2.0;
    let half_h = (rect_y_max - rect_y_min) / 2.0;

    for py in min_y..=max_y {
        for px in min_x..=max_x {
            // Transform canvas pixel (px, py) into the rectangle's local (unrotated) space.
            let dx = px as f32 - cx;
            let dy = py as f32 - cy;

            // Inverse rotation (rotate by -angle)
            let local_x = dx * cos_a + dy * sin_a;
            let local_y = -dx * sin_a + dy * cos_a;

            // The rectangle in local space spans:
            //   x: [rect_x_min - cx, rect_x_max - cx]
            //   y: [rect_y_min - cy, rect_y_max - cy]
            let rect_cx_local = (rect_x_min + rect_x_max) / 2.0 - cx;
            let rect_cy_local = (rect_y_min + rect_y_max) / 2.0 - cy;

            if (local_x - rect_cx_local).abs() <= half_w
                && (local_y - rect_cy_local).abs() <= half_h
            {
                let offset = ((py * cw + px) * 4) as usize;

                // Source-over alpha compositing
                let dst_a = buf[offset + 3] as f32 / 255.0;
                let out_a = src_alpha + dst_a * (1.0 - src_alpha);

                if out_a > 0.0 {
                    buf[offset] = blend(src_r, src_alpha, buf[offset] as f32, dst_a, out_a);
                    buf[offset + 1] = blend(src_g, src_alpha, buf[offset + 1] as f32, dst_a, out_a);
                    buf[offset + 2] = blend(src_b, src_alpha, buf[offset + 2] as f32, dst_a, out_a);
                    buf[offset + 3] = (out_a * 255.0).round().min(255.0) as u8;
                }
            }
        }
    }
}

#[inline]
fn blend(src: f32, src_a: f32, dst: f32, dst_a: f32, out_a: f32) -> u8 {
    ((src * src_a + dst * dst_a * (1.0 - src_a)) / out_a)
        .round()
        .clamp(0.0, 255.0) as u8
}
