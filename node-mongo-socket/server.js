'use strict';

var mongo   = require('mongodb').MongoClient;
var Promise = require('bluebird');
var client  = require('socket.io');

var config = {

  mongo: {
    url: 'mongodb://127.0.0.1/chat'
  },

  socket: {
    port: 8080
  }

};

client = client.listen(config.socket.port).sockets;

client.on('connection', function(socket) {
  console.log('Someone has connected');
});
