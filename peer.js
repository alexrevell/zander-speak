var net = require('net')
var jsonStream = require('duplex-json-stream')
var topology = require('fully-connected-topology');
var streamSet = require('stream-set')

var username = process.argv[2]
var me = process.argv[3]
var peers = process.argv.slice(4)

var connections = streamSet()
var swarm = topology(me, peers)

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
    else {
      console.log(data.username + "> " + data.message + " (" + data.seq +")")
    }
  })
})

process.stdin.on('data', function(data){
  seq ++
  connections.forEach(function(socket){
    socket.write({ username: username, seq: seq,  message: data.toString().trim() })
  })
})
