import http from 'http'
import app from './app'
import { configureChat } from './socket/globalChatConfig'
require('dotenv').config()

const PORT = process.env.APP_PORT!

const server = http.createServer(app)

server.listen(PORT, () => {
    configureChat(server)
    console.log(`http://localhost:${PORT}/`)
})
