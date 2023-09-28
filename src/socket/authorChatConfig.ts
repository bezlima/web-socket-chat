import { Socket } from 'socket.io'
import { randomNameGenerate } from '../utils/randomChatName'
import { disconnect } from './events/disconnect'
import { connectAuthor } from './events/connectAuthor'

export const configureAuthor = (ioChat: any) => {
    ioChat.on('connection', (socket: Socket) => {
        const authorName = randomNameGenerate()

        // adicionar usuário a lista de clientes ativos
        connectAuthor(authorName, socket.id)

        // ao desconectar o usuário
        socket.on('disconnect', () => {
            disconnect(socket, authorName)
        })

        // retorna para o usuário o nome dele
        socket.on('user_name', () => {
            socket.emit('chat_name', authorName)
        })
    })

    return ioChat
}
