const lookup = require('lookup-multicast-dns')
lookup('zander-speak.local')
const net = require('net')
const jsonStream = require('duplex-json-stream')

const socket = jsonStream(net.connect(8124, 'zander-speak.local'))
const username = process.argv[2]

process.stdin.on('data', data => {
  socket.write({ username: username, message: data.toString().trim() })
})

socket.on('data', data => {
  console.log(data.username + "> " + data.message)
})
