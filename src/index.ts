import http from 'http'
import run from './app'
import { port, env } from './config'

console.log('当前环境:', env)

run().then((app) => {
  const server = http.createServer(app.callback())
  server.listen(port)
  server.on('error', (error) => {
    throw error
  })
  server.on('listening', () => {
    console.log('http://127.0.0.1:' + port)
  })
})
