import { Server, Socket } from 'socket.io'
import http from 'http'
import { v4 as uuidv4 } from 'uuid'
import { CHAT } from '../database/DB'
import { randomNameGenerate } from '../utils/randomChatName'
import { CONNECTEDCLIENT } from '../database/connectedClients'

interface Message {
    text: string
    authorId: string
    author: string
    id: string
}

const connectedClientsMap = new Map<string, string>()

export const configureChat = (server: http.Server) => {
    const ioChat = new Server(server, {
        path: '/chat',
        cors: { origin: 'http://localhost:3000' },
    })

    ioChat.on('connection', (socket: Socket) => {
        const user = randomNameGenerate()

        // adicionar usuário a lista de clientes ativos
        addUser(user, socket.id)

        // console.log(CONNECTEDCLIENT)

        // ao desconectar o usuário
        socket.on('disconnect', () => {
            console.log('Usuário desconectado!', user)
            const users = CONNECTEDCLIENT.findIndex((users) => users.authorId === socket.id)

            CONNECTEDCLIENT.splice(users, 1)
        })

        // Manipulador de eventos para a reconexão
        socket.on('reconnect', (attemptNumber: number) => {
            console.log(`Cliente reconectado após ${attemptNumber} tentativas.`)

            // Verifique se o cliente está se reconectando
            if (connectedClientsMap.has(socket.id)) {
                const chatName = connectedClientsMap.get(socket.id)

                // Envie o nome de chat ao cliente
                socket.emit('chat_name', chatName)
            }

            // Você pode adicionar aqui qualquer lógica adicional que desejar após a reconexão bem-sucedida.
        })

        // retorna para o usuário o nome dele
        socket.on('user_name', () => {
            socket.emit('chat_name', user)
        })

        // retorna pro usuário a lista de clientes conectados
        socket.on('chat_clients', () => {
            socket.emit('connected_clients', CONNECTEDCLIENT)
        })

        // ao criar uma mensagem
        socket.on('create_message', (data: { text: string; author: string }) => {
            // fazer verificações separadas
            if (!data.author) {
                console.error('Erro: Nome de usuário não definido para o socket.')
                return
            }

            // Gerar um ID único para a mensagem
            const messageId = uuidv4()

            const message: Message = {
                text: data.text,
                authorId: socket.id,
                author: data.author,
                id: messageId, // Adicionamos o ID único aqui
            }

            CHAT.push(message)

            ioChat.emit('receive_message', message)
        })

        // retorna pro usuário as mensagens do bd
        socket.on('get_messages', () => {
            socket.emit('all_messages', CHAT)
        })

        // editar mensagem
        socket.on('update_message', (data: { messageId: string; newText: string; author: string }) => {
            console.log(data.author)

            if (!data.author) {
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

        //deletar uma mensagem
        socket.on('delete_message', (data: { messageId: string; author: string }) => {
            if (!data.author) {
                console.error('Erro: Nome de usuário não definido para o socket.')
                return
            }

            const messageIndex = CHAT.findIndex(
                (message) => message.authorId === socket.id && message.id === data.messageId
            )

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

function addUser(user: string, id: string) {
    console.log('Usuário conectado!', user, id)

    const adduser = {
        authorId: id,
        author: user,
        status: 0,
    }

    CONNECTEDCLIENT.push(adduser)
}
