import { Gene } from '../Gene/Gene'
import { GeneticOperations } from '../Population/GeneticOperations'
import { EvalGenotypeFitness } from './EvalGenotypeFitness'

export class Genotype implements GeneticOperations {
    private fitnessCached?: number

    public constructor(
        public readonly genes: ReadonlyArray<Gene>,
        private readonly fitnessFunction: EvalGenotypeFitness,
    ) {}

    public get fitness(): number {
        return this.fitnessCached ??= this.fitnessFunction.evalGenotypeFitness(this)
    }

    public crossover({ genes: genesB }: this): this {
        const genesA = this.genes 
        const newGenes = genesA.map((geneA, idx) => geneA.crossover(genesB[idx]))

        return this.cloneWithGenes(newGenes)
    }

    public mutate(): this {
        const newGenes = this.genes.map(gene => gene.mutate())

        return this.cloneWithGenes(newGenes)
    }

    private cloneWithGenes(genes: ReadonlyArray<Gene>): this {
        return new (this.constructor as any)(genes, this.fitnessFunction)
    }
}
