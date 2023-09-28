import { Server, Socket } from 'socket.io'
import http from 'http'
import { CHAT } from '../database/DB'
import { randomNameGenerate } from '../utils/randomChatName'
import { CONNECTEDCLIENT } from '../database/connectedClients'
import { disconnect } from './events/disconnect'
import { createMessage } from './events/createMessage'
import { updateMessage } from './events/updateMessage'
import { deleteMessage } from './events/deleteMessage'
import { connectAuthor } from './events/connectAuthor'

export const configureChat = (server: http.Server) => {
    const ioChat = new Server(server, {
        path: '/chat',
        cors: { origin: 'http://localhost:3000' },
    })

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

        // retorna pro usuário a lista de clientes conectados
        socket.on('chat_clients', () => {
            socket.emit('connected_clients', CONNECTEDCLIENT)
        })

        // retorna pro usuário as mensagens do bd
        socket.on('get_messages', () => {
            socket.emit('all_messages', CHAT)
        })

        // ao criar uma mensagem
        socket.on('create_message', (data: { text: string; author: string }) => {
            const message = createMessage(socket, data)
            ioChat.emit('receive_message', message)
        })

        // editar mensagem
        socket.on('update_message', (data: { messageId: string; newText: string; author: string }) => {
            const updatedMessage = updateMessage(socket, data)
            ioChat.emit('message_updated', updatedMessage)
        })

        //deletar uma mensagem
        socket.on('delete_message', (data: { messageId: string; author: string }) => {
            const deletedMessage = deleteMessage(socket, data)
            ioChat.emit('message_deleted', deletedMessage)
        })
    })

    return ioChat
}
