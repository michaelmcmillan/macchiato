var Sonos = require ('./sonos.js');


var play3 = new Sonos('192.168.1.229');

play3.setQueue('http://coffitivity.com/sounds/audio/ogg/morning_murmur.ogg', function () {
    play3.play();
});
