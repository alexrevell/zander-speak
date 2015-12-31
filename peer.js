var topology = require('fully-connected-topology');

var me = process.argv[2]
var peers = process.argv.slice(3)

var mine = topology(me, peers)

mine.on('connection', function(connection, peer){
  console.log("I am connected to...", peer)
})
