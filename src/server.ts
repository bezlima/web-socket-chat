import http from 'http'
import app from './app'
import { configureChat } from './socket/globalChatConfig'
import { Server } from 'socket.io'
import { configureAuthor } from './socket/authorChatConfig'
import { configureConnectedAuthors } from './socket/connectedAuthorsChatConfig'
require('dotenv').config()

const PORT = process.env.APP_PORT!

const server = http.createServer(app)

const ioChat = new Server(server, {
    path: '/chat',
    cors: { origin: 'http://localhost:3000' },
})

server.listen(PORT, () => {
    configureChat(ioChat)
    configureAuthor(ioChat)
    configureConnectedAuthors(ioChat)
    console.log(`http://localhost:${PORT}/`)
})
