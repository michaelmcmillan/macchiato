var http  = require('http');
var fs    = require('fs');
var Sonos = require ('./sonos.js');

/**
 * Macchiato
 * - Turn your Sonos speakers into a coffee shop!
 */
function Macchiato () {

    // Intro ascii
    this.intro = function () {
        console.log([
            '  +-----+    ',
            '  |     |)   ',
            '  `-----\'   ',
            '___________  ',
            '`---------\' ',
            ' Macchiato   ',
            '   \n        '
        ].join('\n'));
    }();

    // Audio files
    this.audio = [
       'audio/morning.mp3',
       'audio/lunchtime.mp3',
       'audio/university.mp3'
    ];

    // Hold speakers
    this.speakers = [];

    // Local ip
    this.ip = '192.168.1.4';

    // Start the fileserver
    this.server();
}

/**
 * addSpeaker
 * - Adds a speaker to the array
 */
Macchiato.prototype.addSpeaker = function (speaker) {
    if (speaker instanceof Sonos)
        this.speakers.push(speaker);
}

/**
 * transformIntoCoffeeShop
 * - Starts playing audio files
 */
Macchiato.prototype.transformIntoCoffeeShop = function () {
    var self = this;
    this.speakers.forEach(function (speaker) {
        speaker.setQueue(self.ip + '/audio/morning.mp3', function () {
            speaker.play();
        });
    });
}

/**
 * server
 * - Servers audio over http
 */
Macchiato.prototype.server = function () {
    var self = this;

    http.createServer (function (request, response) {
        if (self.audio.indexOf(request.url.substring(1)) !== -1) {
            var filePath = request.url.substring(1);
            var stat = fs.statSync(filePath);
            response.writeHead(200, {
                'Content-Type': 'audio/mp3',
                'Content-Length': stat.size
            });

            fs.createReadStream(filePath).pipe(response);
        }
    }).listen(1337);
}

var macchiato = new Macchiato();
macchiato.addSpeaker(new Sonos(process.argv[2]));
macchiato.transformIntoCoffeeShop();

/*
var sonosDevice = new Sonos(process.argv[2]);
sonosDevice.setQueue("lol.mp3", function () {
    sonosDevice.play();
});
*/
