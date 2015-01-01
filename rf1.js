var gpio = require("pi-gpio"); var _ = require("underscore");
var jsonFile = require('json-file-plus');
var path = require('path'); // in node-core
var filename = path.join(process.cwd(), 'dev-pins.json');

//var socket = require('socket.io-client')('http://192.168.0.101:3300/');
//var socket = require('socket.io-client')('http://10.10.10.119:3300/');
//var socket = require('socket.io-client')('http://10.1.2.4:3300');
var socket = require('socket.io-client')('https://avayah.herokuapp.com');

var nodeNumber = require('./dev-pins.json');
var devicesStateGlobal = require('./dev-pins.json');

var radio = require('nrf').connect("/dev/spidev0.0", 24, 25);

radio.channel(0x4c).dataRate('1Mbps').crcBytes(2).autoRetransmit({count:15, delay:4000});
radio.begin(function () {
  var rx = radio.openPipe('rx', 0xE8E8F0F0E2);
  tx = radio.openPipe('tx', 0xE8E8F0F0E1);

  radio.printDetails();

  socket.on( 'connect', function(){
    console.log('socket connect');
    var devices = require('./dev-pins.json');

    socket.on( 'status', function( data ) {

      console.log(data);
      var relay = devices[ data.switchNum ];

      gpio.open( relay.pin, "output", function( err ) {
        gpio.write( relay.pin, relay.state === 'off' ? 0 : 1, function() {
          gpio.close( relay.pin );
          //relay.state = relay.state === 0 ? 1 : 0;
          socket.emit('device-update', {
            'owner' : 'testfoo@gmail.com',
            'serial': 'red-22',
            'status': 'online',
            'switchNum' : data.switchNum,
            'state' : relay.state === 'off' ? 'on' : 'off'
          });
        
        } );
      } );

      var toDevice = data.switchNum.toString() + '01';      
      var b = new Buffer(4);
      b.writeUInt32BE(parseInt(toDevice), 0);
      //tx.write(b);
    } );

    socket.on( 'link-save', function( data ) {
	
    } );

    socket.on( 'device-state', function( data ) {
      var devices = devicesStateGlobal;
      console.log('device-state!');
      socket.emit('device-state-update', {
        'owner' : 'testfoo@gmail.com',
        'serial': 'red-22',
        'status': 'online',
        'nodes': devices
      });      
    } );

    console.log(devices);
    socket.emit('device-info', {
      'owner' : 'testfoo@gmail.com',
      'serial': 'red-22',
      'status': 'online',
      'nodes': devices
    });

    socket.on( 'disconnect', function(){} );

  } );

  tx.on('error', function (e) {
    console.warn("Error sending reply.", e);
  });

  rx.on('data', function (d) {
   console.log(d);
   console.log("Got response back:", d[31]);
   var devices = require('./dev-pins.json');   

   if(d[31]){
     var total = d[30] + d[31];
     var res = total.toString().split('');
   }
  
   var linkNumber = res[0] + res[1];	
   var relay = _.findWhere(devices, {link: parseInt(linkNumber)});
   console.log(linkNumber);
   
   console.log(relay);
   if(relay){     
   
     gpio.open( relay.pin, "output", function( err ) {
       gpio.write( relay.pin, relay.state === 'off' ? 0 : 1, function() {
         gpio.close( relay.pin );

         socket.emit('device-update', {
           'owner' : 'testfoo@gmail.com',
           'serial': 'red-22',
	   'status': 'online',
           'switchNum' : relay.switchNum,
           'state' : relay.state === 'off' ? 'on' : 'off'
         });
         
         relay.state = relay.state === 'off' ? 'on' : 'off'    
         devicesStateGlobal[relay.switchNum] = relay
         console.log(devicesStateGlobal);     

       });

     } );
     
   }	
  });

});
