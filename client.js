var net = require('net')
var jsonStream = require('duplex-json-stream')
var socket = jsonStream(net.connect(8124))
var username = process.argv[2]

process.stdin.on('data', function(data){
  socket.write({ username: username, message: data.toString().trim() })
})

socket.on('data', function(data){
  console.log(data.username + "> " + data.message)
})
