import { v4 as uuidv4 } from 'uuid'
import { CHAT } from '../database/DB'

interface IMessage {
    text: string
    authorId: string
    author: string
    id: string
}

export function createServerMessage(text: string) {
    const messageId = uuidv4()

    const message: IMessage = {
        text: text,
        authorId: '0000',
        author: 'SERVER',
        id: messageId,
    }

    CHAT.push(message)
}
