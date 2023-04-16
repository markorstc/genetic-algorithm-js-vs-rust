import { Genotype } from './Genotype'

export interface EvalGenotypeFitness {
    evalGenotypeFitness(g: Genotype): Promise<number>
}
