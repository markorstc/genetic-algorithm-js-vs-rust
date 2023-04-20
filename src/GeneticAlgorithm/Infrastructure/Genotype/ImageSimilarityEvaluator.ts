import { TransferableGenotype as GenotypeDTO } from '../../Application/TransferableObject/DTO/TransferableGenotype'
import { Genotype as GenotypeEntity } from '../../Domain/Genotype/Genotype'
import { CanvasRenderer } from './CanvasRenderer'

export class ImageSimilarityEvaluator {

    public constructor(
        private readonly targetImage: ImageData,
        private readonly renderer: CanvasRenderer,
    ) {}

    public evalGenotypeFitness(genotype: Genotype): number {
        const imageData = this.renderer.renderGenotypeImage(genotype)

        return this.similarityPercentage(imageData)
    }

    private similarityPercentage(image: ImageData): number {
        let loss = 0

        const imgData = image.data
        const targetImgData = this.targetImage.data

        for (let i = 0, l = imgData.length; i < l; i += 4) {
            const r = Math.abs(imgData[i] - targetImgData[i]) / 255
            const g = Math.abs(imgData[i+1] - targetImgData[i+1]) / 255
            const b = Math.abs(imgData[i+2] - targetImgData[i+2]) / 255
            // skip alpha [i+3]

            loss += r + g + b
        }

        loss /= (image.width * image.height * 3)

        return (1 - loss) * 100
    }
}

type Genotype = GenotypeEntity | GenotypeDTO
