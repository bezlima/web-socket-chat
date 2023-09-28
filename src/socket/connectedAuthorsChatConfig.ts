import { Socket } from 'socket.io'
import { CONNECTED_AUTHORS } from '../database/connectedAuthors'

export const configureConnectedAuthors = (ioChat: any) => {
    ioChat.on('connection', (socket: Socket) => {
        // retorna pro usuário a lista de clientes conectados
        socket.on('chat_clients', () => {
            socket.emit('connected_clients', CONNECTED_AUTHORS)
        })
    })

    return ioChat
}
