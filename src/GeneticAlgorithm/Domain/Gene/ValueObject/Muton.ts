import { GeneticOperations } from '../../Population/GeneticOperations';

export interface Muton extends GeneticOperations {
    readonly value: any
    valueOf(): number
}
