// Type declarations for wasm-pack generated modules
declare module '*/wasm/rust_genetic_algorithm.js' {
    export function evolve_and_get_fittest(): Uint16Array
    export function get_best_fitness(): number
    export function init_population(
        number_of_shapes: number,
        canvas_width: number,
        canvas_height: number,
        target_pixels: Uint8Array,
        population_size: number,
    ): void
    export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module
    export default function init(
        module_or_path?: InitInput | Promise<InitInput>,
    ): Promise<void>
}

// Vite ?worker query – returns a Worker subclass constructor
declare module '*?worker' {
    class ViteWorker extends Worker {
        constructor()
    }
    export default ViteWorker
}
