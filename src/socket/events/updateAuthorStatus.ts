import { Socket } from 'socket.io'
import { CONNECTED_AUTHORS } from '../../database/connectedAuthors'

interface IData {
    author: string
    status: number
}

export function updateAuthorStatus(socket: Socket, data: IData) {
    if (!data.author) {
        console.error('Erro: Nome de usuário não definido para o socket.')
        return
    }

    const authorIndex = CONNECTED_AUTHORS.findIndex((author) => author.authorId === socket.id)

    if (authorIndex === -1) {
        console.error('Erro: Author não encontrada ou você não tem permissão para atualizá-lo.')
        return
    }

    CONNECTED_AUTHORS[authorIndex].status = data.status
    const updatedAuthor = CONNECTED_AUTHORS[authorIndex]

    return updatedAuthor
}
