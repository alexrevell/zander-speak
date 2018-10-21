require('lookup-multicast-dns')
const net = require('net')
const jsonStream = require('duplex-json-stream')
const topology = require('fully-connected-topology')
const streamSet = require('stream-set')
const hashToPort = require('hash-to-port')
const register = require('register-multicast-dns')
const _ = require('ramda')

const username = process.argv[2]
const peers = process.argv.slice(3)

registerHostName(username)

let me = toAddress(username)
let peerAddresses = _.map(toAddress, peers)
let connections = streamSet()
let swarm = topology(me, peerAddresses)
let curSeq = 0
let id = Math.random()

swarm.on('connection', (socket, peer) => {
  let jacket = jsonStream(socket)
  connections.add(jacket)
  console.log(`connected to ${peer}, ${connections.size} connections` )

  jacket.on('data', data => {
    if (data.seq > curSeq) {
      console.log(`${data.username}> ${data.message}`)
      connections.forEach(conn => transferToSocket(conn, data))
      curSeq = data.seq
    }
  })

  jacket.on('close', () => {
    console.log("active sockets: ", connections.size)
  })
})

process.stdin.on('data', data => {
  curSeq ++
  connections.forEach(conn => writeToSocket(conn, data))
  console.log(`me> ${data.toString().trim()}`)
})

function registerHostName(name) {
  let registerHost = _.compose(register, toHost)
  return registerHost(name)
}

function toAddress(username){
  let toColonisedPort = _.compose(addColon, hashToPort)
  return _.concat(toHost(username), toColonisedPort(username))
}

function toHost (username) { return _.concat(username, ".local") }
function addColon (text) { return _.concat(":", text) }

function transferToSocket(socket, data){
  socket.write({
    id: data.id,
    username: data.username,
    seq: data.seq,
    message: data.toString().trim()
  })
}
function writeToSocket(socket, data){
  socket.write({
    id: id,
    username: username,
    seq: curSeq,
    message: data.toString().trim()
  })
}
