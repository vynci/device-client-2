var gpio = require("pi-gpio");
//var socket = require('socket.io-client')('http://10.10.10.119:3300');
var socket = require('socket.io-client')('http://192.168.0.101:3300');

var nodeNumber = require('./device-pins');

socket.on( 'connect', function(){
  
  socket.on( 'status', function( data ) {
    var relay = nodeNumber[ data.switchNum ];
    gpio.open( relay.pin, "output", function( err ) {
      gpio.write( relay.pin, relay.state === 0 ? 1 : 0, function() {
        gpio.close( relay.pin );
        relay.state = relay.state === 0 ? 1 : 0;
        socket.emit('device-update', {
          'owner' : 'testfoo@gmail.com',
          'serial': 'red-22',
          'status': 'online',
          'switchNum' : data.switchNum,
          'state' : relay.state
        });
        
      } );
    } );
    
    console.log( data );
  } );
  
  socket.emit('device-info', {
    'owner' : 'testfoo@gmail.com',
    'serial': 'red-22',
    'status': 'online'
  });
  
  socket.on( 'disconnect', function(){} );
  
} );
