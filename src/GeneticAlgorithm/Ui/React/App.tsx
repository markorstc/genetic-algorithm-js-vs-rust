import { useState } from 'react'
import { EngineMode } from '../../Application/WebWorkers'
import Canvas from './Canvas'
import ImageInput from './ImageInput'

export default function App() {
    const [targetImage, setTargetImage] = useState<ImageData | null>(null)
    const [isEvolving, setIsEvolving] = useState(false)
    const [numberOfRectangles, setNumberOfRectangles] = useState(20)
    const [engineMode, setEngineMode] = useState<EngineMode>('js')

    const toggle = () => setIsEvolving(prev => !prev)

    return (
        <>
            <h1>Genetic Algorithm – JS vs Rust/WASM</h1>

            <form onSubmit={e => e.preventDefault()} style={{ marginBottom: '1rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <label>
                    Rectangles:&nbsp;
                    <input
                        type="number"
                        min={1}
                        max={200}
                        value={numberOfRectangles}
                        disabled={isEvolving}
                        onChange={e => setNumberOfRectangles(Math.max(1, parseInt(e.target.value) || 1))}
                        style={{ width: '5rem' }}
                    />
                </label>

                <fieldset style={{ border: 'none', padding: 0, display: 'flex', gap: '0.75rem' }}>
                    <legend style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Engine:</legend>
                    <label>
                        <input
                            type="radio"
                            name="engine"
                            value="js"
                            checked={engineMode === 'js'}
                            disabled={isEvolving}
                            onChange={() => setEngineMode('js')}
                        />{' '}
                        JavaScript
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="engine"
                            value="rust"
                            checked={engineMode === 'rust'}
                            disabled={isEvolving}
                            onChange={() => setEngineMode('rust')}
                        />{' '}
                        Rust / WebAssembly
                    </label>
                </fieldset>

                <button onClick={toggle}>
                    {!isEvolving ? 'Evolve' : 'Terminate'}
                </button>
            </form>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <ImageInput onImageData={setTargetImage} />
                <Canvas
                    targetImage={targetImage}
                    numberOfSquares={numberOfRectangles}
                    doEvolve={isEvolving}
                    engineMode={engineMode}
                />
            </div>
        </>
    )
}
