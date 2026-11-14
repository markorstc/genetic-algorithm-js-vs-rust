import init, { add, Genome, init_panic_hook, Population } from './pkg'

const wasm = await init()

init_panic_hook()

add(1, 4);

const parseGenome = () => {
    const genome = new Genome()
    const array = new Uint16Array(wasm.memory.buffer, genome.ptr, genome.len)
    return Array.from({ length: genome.len / 5 }, (_, i) => Array.from(array.subarray(i * 5, i * 5 + 5)))
}

const pop = new Population({
    numberOfShapes: 10,
    targetImageData: new Uint8Array([8, 8]),
    canvasWidth: 100,
    canvasHeight: 100,
})
pop.evolve()
console.log('evolve')

export { add, parseGenome }
