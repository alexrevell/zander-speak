var net = require('net')
var streamSet = require('stream-set')

var activeSockets = streamSet()

var server = net.createServer(function(socket){
  activeSockets.add(socket)
  console.log("active sockets: ", activeSockets.size)

  socket.on('close', function(){
    console.log("active sockets: ", activeSockets.size)
  })

  process.stdin.on('data', function(data){
    socket.write(data)
  })

  socket.on('data', function(data){
    process.stdout.write(data)
  })
})

server.listen(8124)

