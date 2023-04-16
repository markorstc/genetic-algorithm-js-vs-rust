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
        const targetImageData = this.targetImage.data

        let loss = image.data.reduce((loss, rgba, idx) => {
            if ((idx + 1) % 4 === 0) { // every 4th element is alpha, but we compare only colors
                return loss
            }
            return loss + Math.abs(rgba / 255 - targetImageData[idx] / 255)
        }, 0)

        loss /= (image.width * image.height * 3)

        return (1 - loss) * 100
    }
}

type Genotype = GenotypeEntity | GenotypeDTO
