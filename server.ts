import http2, { ServerHttp2Stream } from 'http2'

import { fileURLToPath } from 'url'
import fs from 'fs'
import handler from 'serve-handler'
import nanobuffer from 'nanobuffer'
import path from 'path'

const connections = new Set<ServerHttp2Stream>()

const msg = new nanobuffer(50)
const getMsgs = () => Array.from(msg)

msg.push({
  user: 'Mikke',
  text: 'moro',
  time: Date.now(),
})

// the two commands you'll have to run in the root directory of the project are
//
// openssl req -new -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
// openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt
//
// http2 only works over HTTPS
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const server = http2.createSecureServer({
  cert: fs.readFileSync(path.join(__dirname, './server.crt')),
  key: fs.readFileSync(path.join(__dirname, './key.pem')),
})

server.on('stream', async (stream, headers) => {
  const path = headers[':path']
  const method = headers[':method']
  if (path === '/msgs' && method === 'GET') {
    console.log('connected: ', stream.id)
    stream.respond({
      ':status': 200,
      'content-type': 'text/plain; charset=utf-8',
    })

    stream.write(JSON.stringify({ msg: getMsgs() }))
    connections.add(stream)

    stream.on('close', () => {
      console.log('disconnected')
      connections.delete(stream)
    })
  }
})

server.on('request', async (req, res) => {
  const path = req.headers[':path']
  const method = req.headers[':method']

  if (path !== '/msgs') {
    // handle the static assets
    return handler(req, res, {
      public: '.',
    })
  } else if (method === 'POST') {
    // get data out of post
    const buffers = []
    for await (const chunk of req) {
      buffers.push(chunk)
    }
    const data = Buffer.concat(buffers).toString()
    const { user, text } = JSON.parse(data)

    msg.push({
      user,
      text,
      time: Date.now(),
    })

    res.end()

    for (const stream of connections) {
      stream.write(JSON.stringify({ msg: getMsgs() }))
    }
  }
})

// start listening
const port = process.env.PORT || 8080
server.listen(port, () =>
  console.log(`Server running at https://localhost:${port} - make sure you're on httpS, not http`)
)
