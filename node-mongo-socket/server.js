var mongo = require('mongodb').MongoClient;

var client = require('socket.io').listen(8080).sockets;


client.on('connection', function(socket) {
  console.log('Someone has connected');
});
