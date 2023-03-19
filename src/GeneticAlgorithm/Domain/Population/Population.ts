import { EvaluableGeneticOperations } from './GeneticOperations'

export class Population<T extends EvaluableGeneticOperations> extends Array<T> {
    public fittest(): T | undefined {
        return this.sort()[0]
    }

    public evolve(): Population<T> {
        const parents = this
        const newborns = new Population<T>()

        const topParents = <Population<T>> parents
            .sort()
            .slice(0, Math.ceil(parents.length * .40))

        const immortals = topParents.slice(0, Math.ceil(parents.length * .05))

        newborns.push(...immortals)

        while (newborns.length < parents.length) {
            // Sodom and Gomorrah
            const parentA = topParents.random()!
            const parentB = topParents.random()!

            let newborn = parentA.crossover(parentB)

            if (Math.random() < .10) {
                newborn = newborn.mutate()
            }

            newborns.push(newborn)
        }

        return newborns
    }

    public sort(compareFn?: (dnaA: T, dnaB: T) => number): this {
        if (compareFn === undefined) {
            return super.sort((dnaA, dnaB) => dnaB.fitness - dnaA.fitness)
        }

        return super.sort(compareFn)
    }

    public random(): T | undefined {
        return this[Math.floor(Math.random() * this.length)]
    }
}
