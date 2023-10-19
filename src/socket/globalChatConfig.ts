import { Socket } from 'socket.io'
import { CHAT } from '../database/DB'
import { createMessage } from './events/createMessage'
import { updateMessage } from './events/updateMessage'
import { deleteMessage } from './events/deleteMessage'

export const configureChat = (ioChat: any) => {
    ioChat.on('connection', (socket: Socket) => {
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
            if (updatedMessage) {
                ioChat.emit('message_updated', updatedMessage)
            } else {
                return
            }
        })

        //deletar uma mensagem
        socket.on('delete_message', (data: { messageId: string; author: string }) => {
            const deletedMessage = deleteMessage(socket, data)
            if (deletedMessage) {
                ioChat.emit('message_deleted', deletedMessage)
            } else {
                return
            }
        })
    })

    return ioChat
}
