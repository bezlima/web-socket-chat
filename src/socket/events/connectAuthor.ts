import { CONNECTED_AUTHORS } from '../../database/connectedAuthors'
import { createServerMessage } from '../../utils/serverMessage'

export function connectAuthor(authorName: string, id: string) {
    const newAuthor = {
        authorId: id,
        author: authorName,
        status: 0,
    }

    CONNECTED_AUTHORS.push(newAuthor)
    createServerMessage(`O ${authorName} entrou no chat`)
}
