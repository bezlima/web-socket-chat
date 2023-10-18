import { v4 as uuidv4 } from 'uuid'
import { CHAT } from '../database/DB'

interface IMessage {
    text: string
    authorId: string
    author: string
    id: string
    status: 0
}

export function createServerMessage(text: string) {
    const messageId = uuidv4()

    const message: IMessage = {
        text: text,
        authorId: '0000',
        author: 'SERVER',
        id: messageId,
        status: 0,
    }

    CHAT.push(message)

    return message
}
