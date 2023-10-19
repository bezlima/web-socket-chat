import { CHAT } from '../../database/DB'
import { Socket } from 'socket.io'

interface IData {
    messageId: string
    author: string
}
export function deleteMessage(socket: Socket, data: IData) {
    if (!data.author) {
        console.error('Erro: Nome de usuário não definido para o socket.')
        return
    }

    const messageIndex = CHAT.findIndex((message) => message.authorId === socket.id && message.id === data.messageId)

    if (messageIndex === -1) {
        console.error('Erro: Mensagem não encontrada ou você não tem permissão para atualizá-la.')
        return {}
    }

    CHAT[messageIndex].text = 'Mensagem excluída pelo autor'
    CHAT[messageIndex].status = 2
    const deletedMessage = CHAT[messageIndex]

    return deletedMessage
}
