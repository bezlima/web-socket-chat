import { Server, Socket } from 'socket.io'
import http from 'http'
import { v4 as uuidv4 } from 'uuid'
import { CHAT } from '../database/DB'

interface Message {
    text: string
    authorId: string
    author: string
    id: string
}

export const configureChat = (server: http.Server) => {
    const ioChat = new Server(server, {
        path: '/chat',
        cors: { origin: 'http://localhost:3000' },
    })

    ioChat.on('connection', (socket: Socket) => {
        console.log('Usuário conectado!', socket.id)

        socket.on('disconnect', (reason: string) => {
            console.log('Usuário desconectado!', socket.id)
        })

        socket.on('set_username', (username: string) => {
            socket.data.username = username
        })

        socket.on('create_message', (data: { text: string }) => {
            if (!socket.data.username) {
                console.error('Erro: Nome de usuário não definido para o socket.')
                return
            }

            // Gerar um ID único para a mensagem
            const messageId = uuidv4()

            const message: Message = {
                text: data.text,
                authorId: socket.id,
                author: socket.data.username,
                id: messageId, // Adicionamos o ID único aqui
            }

            CHAT.push(message)

            ioChat.emit('receive_message', message)
        })

        socket.on('get_messages', () => {
            socket.emit('all_messages', CHAT)
        })

        socket.on('update_message', (data: { messageId: string; newText: string }) => {
            if (!socket.data.username) {
                console.error('Erro: Nome de usuário não definido para o socket.')
                return
            }

            const messageIndex = CHAT.findIndex(
                (message) => message.authorId === socket.id && message.id === data.messageId
            )

            if (messageIndex === -1) {
                console.error('Erro: Mensagem não encontrada ou você não tem permissão para atualizá-la.')
                return
            }

            CHAT[messageIndex].text = data.newText
            const updatedMessage = CHAT[messageIndex]

            ioChat.emit('message_updated', updatedMessage)
        })

        socket.on('delete_message', (messageId: string) => {
            if (!socket.data.username) {
                console.error('Erro: Nome de usuário não definido para o socket.')
                return
            }

            const messageIndex = CHAT.findIndex((message) => message.authorId === socket.id && message.id === messageId)

            if (messageIndex === -1) {
                console.error('Erro: Mensagem não encontrada ou você não tem permissão para excluí-la.')
                return
            }

            const deletedMessage = CHAT.splice(messageIndex, 1)[0]

            ioChat.emit('message_deleted', deletedMessage.id) // Envie apenas o ID da mensagem excluída
        })
    })

    return ioChat
}
