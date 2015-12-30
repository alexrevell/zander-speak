var net = require('net')

var server = net.createServer(function(socket){
  console.log("client connected")
  socket.on('data', function(data){
    socket.write(data)
  })
})

server.listen(8124, function(){
  var address = server.address()
  console.log("server bound, listening on ", address)
})
