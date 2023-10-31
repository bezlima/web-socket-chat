import { CHAT } from '../../database/DB'
import { v4 as uuidv4 } from 'uuid'
import { Socket } from 'socket.io'

interface IMessage {
    text: string
    authorId: string
    author: string
    id: string
    status: number
}

interface IData {
    text: string
    author: string
}

export function createMessage(socket: Socket, data: IData) {
    // fazer verificações separadas
    if (!data.author) {
        console.error('Erro: Nome de usuário não definido para o socket.')
        return
    } else if (data.text === '') {
        console.error('Erro: Mensagens excluídas não podem ser vazias')
        return {}
    } else {
        // Gerar um ID único para a mensagem
        const messageId = uuidv4()

        const message: IMessage = {
            text: data.text,
            authorId: socket.id,
            author: data.author,
            id: messageId,
            status: 0,
        }

        CHAT.push(message)

        return message
    }
}
