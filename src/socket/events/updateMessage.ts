import { CHAT } from '../../database/DB'
import { Socket } from 'socket.io'

interface IData {
    messageId: string
    newText: string
    author: string
}
export function updateMessage(socket: Socket, data: IData) {
    if (!data.author) {
        console.error('Erro: Nome de usuário não definido para o socket.')
        return
    } else {
        const messageIndex = CHAT.findIndex(
            (message) => message.authorId === socket.id && message.id === data.messageId
        )

        if (messageIndex === -1) {
            console.error('Erro: Mensagem não encontrada ou você não tem permissão para atualizá-la.')
            return {}
        } else if (CHAT[messageIndex].status === 2) {
            console.error('Erro: Mensagens excluídas não podem ser deletadas')
            return {}
        } else {
            CHAT[messageIndex].text = data.newText
            CHAT[messageIndex].status = 1
            const updatedMessage = CHAT[messageIndex]

            return updatedMessage
        }
    }
}
