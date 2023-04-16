import { Genotype } from '../Genotype/Genotype'

export class Population<T extends Genotype> extends Array<T> {

    public fittest(): T | undefined {
        return this.sort()[0]
    }

    public async evolve(): Promise<Population<T>> {
        const parents = this
        const newborns = new Population<T>()

        await parents.resolveFitness()

        const topParents = parents.slice(0, Math.ceil(parents.length * .40)) as Population<T>
        const immortals = topParents.slice(0, Math.ceil(topParents.length * .05))

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

    public random(): T | undefined {
        return this[Math.floor(Math.random() * this.length)]
    }

    public async resolveFitness(): Promise<this> {
        await Promise.all(this.map(dna => dna.resolveFitness()))

        return this.sort((dnaA, dnaB) => dnaB.fitness! - dnaA.fitness!)
    }
}
