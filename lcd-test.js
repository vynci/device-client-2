var lowerCase = [ null, null, null, null, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
'y', 'z'
];

var Wireless = require('wireless');
var connected = false;
var os=require('os');
var ifaces=os.networkInterfaces();
var exec = require('child_process').exec;
var child;
var SSID = '';

var iface = process.argv[2];

child = exec('iwgetid -r',
  function (error, stdout, stderr) {
    SSID = stdout;
    console.log(stdout);
});

child = exec("espeak -ven+f3 -k5 -s130 \"Connected to Network\"", function (error, stdout, stderr) {
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});

if (!iface) {
    console.log("Usage: " + process.argv[1] + " wlan0");
}

var wireless = new Wireless({
    iface: iface,
    updateFrequency: 12,
    vanishThreshold: 7,
});

var gpio = require("pi-gpio");
var Lcd = require('lcd');
var lcd = new Lcd({rs:21, e:26, data:[19, 13, 6, 5], cols:16, rows:2});

var HID = require('node-hid');
var key_pressed = 0;
var ssid = '';


lcd.on('ready', function () {
  lcd.setCursor(0, 0);
  
  lcd.print('SSID:' + SSID);

  lcd.once('printed', function () {
    lcd.setCursor(0, 1);                                  // col 0, row 1
    lcd.print('IP:' + ifaces['wlan0'][0].address);
    lcd.once('printed', function () {

    });
  });

});


function printLCD( field, data) {
  
  lcd.setCursor(0, 0);
  lcd.print(field);

  lcd.once('printed', function () {
    lcd.setCursor(0, 1);                                  // col 0, row 1
    lcd.print(data);
    lcd.once('printed', function () {

    });
  });
}
