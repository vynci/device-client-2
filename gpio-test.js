var gpio = require("pi-gpio");
var readline = require('readline');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var nodeNumber = require('./dev-pins.json');

rl.question('Enter Relay Number: ', function(ans){
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
  rl.close();

});


