import { Socket } from 'socket.io'
import { CONNECTEDCLIENT } from '../database/connectedClients'

export const configureConnectedAuthors = (ioChat: any) => {
    ioChat.on('connection', (socket: Socket) => {
        // retorna pro usuário a lista de clientes conectados
        socket.on('chat_clients', () => {
            socket.emit('connected_clients', CONNECTEDCLIENT)
        })
    })

    return ioChat
}
