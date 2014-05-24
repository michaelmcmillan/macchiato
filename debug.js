var Sonos = require('./sonos.js');


var play3 = new Sonos (process.argv[2])

play3.getPositionInfo(function (data) {
    console.log(data);
});
