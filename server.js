var net = require('net')
var streamSet = require('stream-set')

var activeSockets = streamSet()

var server = net.createServer(function(socket){
  console.log("client connected")

  activeSockets.add(socket)
  console.log("active sockets: ", activeSockets.size)

  socket.on('close', function(){
    console.log("active sockets: ", activeSockets.size)
  })

  socket.on('data', function(data){
    socket.write(data)
  })
})

server.listen(8124, function(){
  console.log("server bound, listening on ", server.address)
  var socket = net.connect(8124)
  socket.on('connect', function(){
    console.log("socket connected")
    socket.destroy()
  })
})
