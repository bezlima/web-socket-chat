import { CONNECTED_AUTHORS } from '../../database/connectedAuthors'

export function connectAuthor(authorName: string, id: string) {
    const newAuthor = {
        authorId: id,
        author: authorName,
        status: 0,
    }

    CONNECTED_AUTHORS.push(newAuthor)
}
