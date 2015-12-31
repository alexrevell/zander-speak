var net = require('net')
var jsonStream = require('duplex-json-stream')
var topology = require('fully-connected-topology');
var streamSet = require('stream-set')

var username = process.argv[2]
var me = process.argv[3]
var peers = process.argv.slice(4)

var activeSockets = streamSet()
var swarm = topology(me, peers)

swarm.on('connection', function(socket, id){
  socket = jsonStream(socket)
  activeSockets.add(socket)
  console.log("I am connected to...", id)
  console.log("active sockets: ", activeSockets.size)

  socket.on('close', function(){
    console.log("active sockets: ", activeSockets.size)
  })

  socket.on('data', function(data){
    console.log(data.username + "> " + data.message)

    // var senderIndex = getIndex(socket)
    // var recipients = activeSockets.streams.filter(function(stream){
    //   return matchIndex(senderIndex, stream)
    // })

    // recipients.forEach(function(stream){
    //   stream.write({ username: data.username, message: data.message })
    // })
  })

  process.stdin.on('data', function(data){
    socket.write({ username: username, message: data.toString().trim() })
  })

  // swarm.on('data', function(data){
  //   console.log(data)
  // })
})

var getIndex = function(stream){
  return activeSockets.streams.indexOf(stream)
}

var matchIndex = function(index, stream){
  return getIndex(stream) !== index
}
