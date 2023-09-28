import { CONNECTEDCLIENT } from '../../database/connectedClients'
import { createServerMessage } from '../../utils/serverMessage'
import { Socket } from 'socket.io'

export function disconnect(socket: Socket, authorName: string) {
    createServerMessage(`O ${authorName} saiu do chat`)
    const disconnectAuthor = CONNECTEDCLIENT.findIndex((author) => author.authorId === socket.id)
    CONNECTEDCLIENT.splice(disconnectAuthor, 1)
    return
}
