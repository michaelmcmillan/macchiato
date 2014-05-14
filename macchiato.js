var http  = require('http');
var fs    = require('fs');
var Sonos = require ('./sonos.js');

/**
 * Macchiato
 * - Turn your Sonos speakers into a coffee shop!
 */
function Macchiato (ip, port) {

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

    // Local ip, port and host
    this.ip = ip || '192.168.1.4';
    this.port = port || 1337;
    this.host = 'http://' + this.ip + ':' + this.port;

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
        speaker.setQueue(self.host + '/audio/university.mp3', function () {
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
        var filePath = request.url.substring(1);
        var sonosIp  = request.connection.remoteAddress;

        if (self.audio.indexOf(filePath) !== -1) {
            var stat = fs.statSync(filePath);
            response.writeHead(200, {
                'Content-Type': 'audio/mp3',
                'Content-Length': stat.size
            });

            fs.createReadStream(filePath).pipe(response);
            console.log ('[*] Macchiato: Streaming "%s to speaker %s', filePath, sonosIp);
        }
        else
            console.log ('[*] Macchiato: File not found.');
    }).listen(this.port);
}

/**
 * Program
 * - Transforms first argument speaker to a coffee shop
 */
var macchiato = new Macchiato ();
macchiato.addSpeaker(new Sonos (process.argv[2]));
macchiato.transformIntoCoffeeShop();
