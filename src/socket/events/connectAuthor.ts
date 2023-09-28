import { CONNECTEDCLIENT } from '../../database/connectedClients'
import { createServerMessage } from '../../utils/serverMessage'

export function connectAuthor(authorName: string, id: string) {
    const newAuthor = {
        authorId: id,
        author: authorName,
        status: 0,
    }

    CONNECTEDCLIENT.push(newAuthor)
    createServerMessage(`O ${authorName} entrou no chat`)
}
