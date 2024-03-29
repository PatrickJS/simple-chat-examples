'use strict';

var mongo   = require('mongodb').MongoClient;
// var Promise = require('bluebird');
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

mongo.connect(config.mongo.url, function(err, db) {
  if (err) {
    throw err;
  }

  client.on('connection', function(socket) {
    console.log('Someone has connected');

    var col = db.collection('messages');
    var sendStatus = function(s) {
      socket.emit('status', s);
    };
    col.find().limit(100).sort({_id: 1}).toArray(function(err, result) {
      if (err) throw err;

      socket.emit('output', result);
    });

    // wait for input
    socket.on('input', function(data) {
      var name = data.name;
      var message = data.message;
      var whitespacePattern = /^\s*$/;

      if (whitespacePattern.test(name) || whitespacePattern.test(message)) {
        console.log('Invalid input', data);
        sendStatus('Name and Message is required');
      } else {
        var obj = {
          name: name,
          message: message,
          created_at: new Date()
        };
        col.insert(obj, function(err) {
          console.log('Valid input', obj);
          client.emit('output', [obj]);

          sendStatus({
            message: 'Message sent!',
            clear: true
          });
        });
      }

    });

  });

});

