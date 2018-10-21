const register = require('register-multicast-dns')
register('zander-speak.local')
const net = require('net')
const streamSet = require('stream-set')
const jsonStream = require('duplex-json-stream')

const activeSockets = streamSet()

const server = net.createServer(socket => {
  socket = jsonStream(socket)
  activeSockets.add(socket)
  console.log("active sockets: ", activeSockets.size)

  socket.on('close', () => {
    console.log("active sockets: ", activeSockets.size)
  })

  socket.on('data', ({ message, username }) => {
    const senderIndex = getIndex(socket)
    const { streams } = activeSockets
    const recipients = streams.filter((stream, idx) => senderIndex !== idx)

    recipients.forEach(stream => {
      stream.write({ username, message })
    })
  })
})

server.listen(process.env.PORT || 8124)

function getIndex(stream){
  return activeSockets.streams.indexOf(stream)
}

function matchIndex(index) {
  return stream => getIndex(stream) !== index
}
