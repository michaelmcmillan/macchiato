var Sonos = require('./sonos.js');
var xml2js = require('xml2js');

/*
var play3 = new Sonos (process.argv[2])

play3.getVolume(function (volume) {
    play3.setVolume(volume - 30);
});

play3.setQueue('http://archive.org/download/TenD2005-07-16.flac16/TenD2005-07-16t10Wonderboy_64kb.mp3', function () {
    play3.play();
});
*/


var obj = {name: "Super", Surname: "Man", age: 23};

var builder = new xml2js.Builder({renderOpts: { 'pretty': true, 'indent': ' ', 'newline': '\n' }});
var xml = builder.buildObject(obj);
console.log(xml);
