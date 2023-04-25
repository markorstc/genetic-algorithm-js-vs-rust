import { useState } from 'react'
import Canvas from './Canvas'
import ImageInput from './ImageInput'

export default function App() {
    const [targetImage, setTargetImage] = useState<ImageData | null>(null)
    const [isEvolving, setIsEvolving] = useState(false)

    return (
        <>
            <h1>Genetic algo demo</h1>
            <ImageInput onImageData={setTargetImage} />
            <Canvas targetImage={targetImage} numberOfSquares={10} doEvolve={isEvolving} />
            <form onSubmit={e => e.preventDefault()}>
                <button onClick={() => setIsEvolving(prevState => !prevState)}>
                    {!isEvolving ? 'Evolve' : 'Terminate'}
                </button>
            </form>
        </>
    )
}
