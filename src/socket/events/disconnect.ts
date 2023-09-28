import { CONNECTED_AUTHORS } from '../../database/connectedAuthors'
import { createServerMessage } from '../../utils/serverMessage'
import { Socket } from 'socket.io'

export function disconnect(socket: Socket, authorName: string) {
    createServerMessage(`O ${authorName} saiu do chat`)
    const disconnectAuthor = CONNECTED_AUTHORS.findIndex((author) => author.authorId === socket.id)
    CONNECTED_AUTHORS.splice(disconnectAuthor, 1)
    return
}