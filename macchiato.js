var Sonos = require ('./sonos.js');
var audio = [
   'http://coffitivity.com/sounds/audio/ogg/morning_murmur.ogg',
   'http://coffitivity.com/sounds/audio/ogg/university_undertones.ogg',
   'http://coffitivity.com/sounds/audio/ogg/lunchtime_lounge.ogg'
];

var sonosDevice = new Sonos(process.argv[2]);
sonosDevice.setQueue(audio[0], function () {
    sonosDevice.play();
});
