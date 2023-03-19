import { usePopulation, useImageData, useWebWorkers } from './GeneticAlgorithm'
import { RefObject, useRef } from 'react'
import { CanvasRenderer } from '../../Infrastructure/Genotype/CanvasRenderer'

export default function Cavas({ targetImage }: Props) {
    const workers = useWebWorkers()
    const canvas = useRef<HTMLCanvasElement>(null)

    const onClick = () => {
        if (!targetImage.current) {
            return
        }

        useImageData(targetImage.current).then(async (imageData) => {
            if (!canvas.current) {
                return
            }

            const targetImage = imageData
            const { width: canvasWidth, height: canvasHeight } = targetImage

            canvas.current.width = canvasWidth
            canvas.current.height = canvasHeight

            await Promise.all([
                workers.population.init({ numberOfShapes: 30, targetImage, canvasWidth, canvasHeight }),
                workers.canvas.init(canvas.current.transferControlToOffscreen()),
            ])

            let i = 300

            async function drawIt() {
                console.log(i)

                try {
                    const bestGenotype = await workers.population.evolveAndFindFittest()
                    workers.canvas.renderGenotype(bestGenotype)
                } catch (e) {
                    console.error(e)
                }

                if (--i > 0) {
                    drawIt()
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
