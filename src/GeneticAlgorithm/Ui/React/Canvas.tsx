import { usePopulation, useImageData } from './GeneticAlgorithm'
import { RefObject, useRef } from 'react'

export default function Cavas({ targetImage }: Props) {
    const canvas = useRef<HTMLCanvasElement>(null)

    const onClick = () => {
        if (!targetImage.current) {
            return
        }

        useImageData(targetImage.current).then(imageData => {
            if (!canvas.current) {
                return
            }

            canvas.current.width = imageData.width
            canvas.current.height = imageData.height

            let shapes = usePopulation({ numberOfShapes: 20, targetImage: imageData, canvas: canvas.current })

            let i = 50

            function drawIt() {
                console.log(i)

                shapes = shapes.evolve()
                shapes.fittest()?.render()

                if (--i > 0) {
                    //drawIt()
                    requestAnimationFrame(drawIt)
                }
            }

            drawIt()
        })
    }

    return (
        <>
            <button onClick={onClick}>Evolve</button>
            <canvas ref={canvas}></canvas>
        </>
    )
}

type Props = { targetImage: RefObject<HTMLImageElement> }
