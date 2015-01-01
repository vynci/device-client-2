var gpio = require("pi-gpio");
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var nodeNumber = require('./dev-pins.json');

rl.question('Enter Relay Number [1-Unused | 2-OutNorth | 3-Bedroom | 4-Oct1 | 5-Stairs | 6-OutEast | 7-OutWest | 8-Oct2],[on|off], e.g. 5,off : ', function(ans){
  var res = ans.split(',');
  var state = res[1] === 'off' ? 1 : 0;

  var relay = nodeNumber[ res[0] ];
  gpio.open( relay.pin, "output", function( err ) {
  // gpio.write(arg1, arg2, arg3)
  // arg2 >> 1 : off, 0 : on	
    gpio.write( relay.pin, state, function() {
      gpio.close( relay.pin );
    } );
  } );

//  Assignment PhD
//  setTimeout(function(){
//	console.log('hello');
//  },1000);

  rl.close();

});


