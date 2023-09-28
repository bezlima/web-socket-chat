import { CONNECTED_AUTHORS } from '../database/connectedAuthors'
import { ANIMALS, COLORS } from '../database/clientNames'

export function randomNameGenerate(): string {
    let randomName: string

    do {
        const randomAnimalNumber: number = Math.floor(Math.random() * 20) + 1
        const randomColorNumber: number = Math.floor(Math.random() * 20) + 1

        const randomAnimal: string = ANIMALS[randomAnimalNumber]
        const randomColor: string = COLORS[randomColorNumber]

        randomName = `${randomAnimal} ${randomColor}`
    } while (CONNECTED_AUTHORS.some((cliente) => cliente.author === randomName))

    return randomName
}
