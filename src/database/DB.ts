interface IMessage {
    text: string
    authorId: string
    author: string
    id: string
    status: number
}

export const CHAT: IMessage[] = []
