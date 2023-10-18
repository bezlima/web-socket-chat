import { Socket } from 'socket.io'
import { randomNameGenerate } from '../utils/randomChatName'
import { disconnect } from './events/disconnect'
import { connectAuthor } from './events/connectAuthor'
import { updateAuthorStatus } from './events/updateAuthorStatus'
import { createServerMessage } from '../utils/serverMessage'

export const configureAuthor = (ioChat: any) => {
    ioChat.on('connection', (socket: Socket) => {
        const authorName = randomNameGenerate()

        // adicionar usuário a lista de clientes ativos
        connectAuthor(authorName, socket.id)

        // ao desconectar o usuário
        socket.on('disconnect', () => {
            const { CONNECTED_AUTHORS } = disconnect(socket, authorName)
            let message = createServerMessage(`O ${authorName} saiu do chat`)
            ioChat.emit('disconnected_authors', CONNECTED_AUTHORS)
            ioChat.emit('receive_message', message)
        })

        // retorna para o usuário o nome dele
        socket.on('user_name', () => {
            const message = createServerMessage(`O ${authorName} entrou no chat`)
            socket.emit('chat_name', authorName)
            ioChat.emit('receive_message', message)
        })

        // atualiza o status do usuário
        socket.on('update_status', (data: { author: string; status: number }) => {
            const updateStatus = updateAuthorStatus(socket, data)
            ioChat.emit('author_status', updateStatus)
        })
    })

    return ioChat
}
