import { useState, useRef, ChangeEvent } from 'react'
import Canvas from './GeneticAlgorithm/Ui/React/Canvas'

function ImageInput() {
    const [file, setFile] = useState<File>()
    const onChange = (e: ChangeEvent<HTMLInputElement>) => setFile(e.currentTarget.files?.item(0) ?? undefined)
    const targetImage = useRef<HTMLImageElement>(null)

    return (
        <>
            <input type="file" accept="image/*" onChange={onChange} />
            {file && <img src={URL.createObjectURL(file)} width={500} ref={targetImage} />}
            {file && <Canvas targetImage={targetImage} />}
        </>
    )
}

export default ImageInput
