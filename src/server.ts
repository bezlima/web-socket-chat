import http from 'http'
import app from './app'
import { configureChat } from './socket/globalChatConfig'
import { Server } from 'socket.io'
require('dotenv').config()

const PORT = process.env.APP_PORT!

const server = http.createServer(app)

const ioChat = new Server(server, {
    path: '/chat',
    cors: { origin: 'http://localhost:3000' },
})

server.listen(PORT, () => {
    configureChat(ioChat)
    console.log(`http://localhost:${PORT}/`)
})
