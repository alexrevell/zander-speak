var net = require('net')
var streamSet = require('stream-set')
var jsonStream = require('duplex-json-stream')

var activeSockets = streamSet()

var server = net.createServer(function(socket){
  socket = jsonStream(socket)
  activeSockets.add(socket)
  console.log("active sockets: ", activeSockets.size)

  socket.on('close', function(){
    console.log("active sockets: ", activeSockets.size)
  })

  socket.on('data', function(data){
    var senderIndex = getIndex(socket)
    var recipients = activeSockets.streams.filter(function(stream){
      return matchIndex(senderIndex, stream)
    })

    recipients.forEach(function(stream){
      stream.write({ username: data.username, message: data.message })
    })
  })
})

server.listen(8124)

var getIndex = function(stream){
  return activeSockets.streams.indexOf(stream)
}

var matchIndex = function(index, stream){
  return getIndex(stream) !== index
}
