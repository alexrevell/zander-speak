var net = require('net')
require('lookup-multicast-dns')
var jsonStream = require('duplex-json-stream')
var topology = require('fully-connected-topology');
var streamSet = require('stream-set')
var hashToPort = require('hash-to-port')
var register = require('register-multicast-dns')

var username = process.argv[2]
var peers = process.argv.slice(3)

register(toHost(username))

var me = toAddress(username)
var peerAddresses = peers.map(toAddress)

var connections = streamSet()
var swarm = topology(me, peerAddresses)

var seq = 0
var id = Math.random()

swarm.on('connection', function(socket, peer){
  socket = jsonStream(socket)
  connections.add(socket)
  console.log("I am connected to...", peer)
  console.log("active sockets: ", connections.size)

  socket.on('close', function(){
    console.log("active sockets: ", connections.size)
  })

  socket.on('data', function(data){
    if (data.seq > seq) {
      console.log(data.username + "> " + data.message + " (" + data.seq +")")
      connections.forEach(function(socket){
        socket.write({ username: data.username, seq: data.seq,  message: data.message.toString().trim() })
      })
      seq = data.seq
    }
  })
})

process.stdin.on('data', function(data){
  seq ++
  connections.forEach(function(socket){
    socket.write({ username: username, seq: seq,  message: data.toString().trim() })
  })
})

function toAddress (username) {
  return toHost(username) + ':' + hashToPort(username)
}
function toHost (username) {
  return username + '.local'
}
