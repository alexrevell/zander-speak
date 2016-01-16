import 'lookup-multicast-dns'
import net from 'net'
import jsonStream from 'duplex-json-stream'
import topology from 'fully-connected-topology'
import streamSet from 'stream-set'
import hashToPort from 'hash-to-port'
import register from 'register-multicast-dns'
import _ from 'ramda'

let username = process.argv[2]
let peers = process.argv.slice(3)

registerHostName(username)

let me = toAddress(username)
let peerAddresses = _.map(toAddress, peers)
let connections = streamSet()
let swarm = topology(me, peerAddresses)
let curSeq = 0
let id = Math.random()

swarm.on('connection', (socket, peer) => {
  socket = jsonStream(socket)
  connections.add(socket)
  console.log(`connected to ${peer}, ${connections.size} connections` )

  socket.on('data', data => {
    if (data.seq > curSeq) {
      console.log(`${data.username}> ${data.message}`)
      connections.forEach(socket => transferToSocket(socket, data))
      curSeq = data.seq
    }
  })

  socket.on('close', () => {
    console.log("active sockets: ", connections.size)
  })
})

process.stdin.on('data', data => {
  curSeq ++
  connections.forEach(socket => writeToSocket(socket, data))
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
