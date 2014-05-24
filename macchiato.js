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
            '     )))     ',
            '    (((      ',
            '  +-----+    ',
            '  |     |)   ',
            '  `-----\'   ',
            '___________  ',
            '`---------\' ',
            ' Macchiato   ',
            '             '
        ].join('\n'));
    }();

    // User interface
    this.userInterface = 'html/index.htm';

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

    // Register exit-handling
    this.sigintHandler();
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
 * playAll
 * - Pauses all speakers
 */
Macchiato.prototype.playAll = function () {
    this.speakers.forEach(function (speaker) {
        speaker.play();
    });
}

/**
 * pauseAll
 * - Pauses all speakers
 */
Macchiato.prototype.pauseAll = function () {
    this.speakers.forEach(function (speaker) {
        speaker.pause();
    });
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

        /* Stream audio file (200) */
        if (self.audio.indexOf(filePath) !== -1) {
            var stat = fs.statSync(filePath);
            response.writeHead(200, {
                'Content-Type': 'audio/mp3',
                'Content-Length': stat.size
            });

            fs.createReadStream(filePath).pipe(response);
            console.log ('[*] Macchiato: Streaming "%s" to speaker %s',
                filePath, sonosIp);
        }

        /* User interface (200) */
        else if (filePath == '') {
            var stat = fs.statSync(self.userInterface);
            response.writeHead(200, {
                'Content-Type': 'text/html',
                'Content-Length': stat.size
            });

            fs.createReadStream(self.userInterface).pipe(response);
        }

        /* JSON API (200) */
        else if (filePath.indexOf('api/') !== -1) {
            var args = filePath.split('/');
            var success = false, message = '';
            switch (args[1]) {
                case 'play':  self.playAll();        success = true;  break;
                case 'pause': self.pauseAll();       success = true;  break;
                default: message = 'Illegal action'; success = false; break;
            }

            var body = JSON.stringify({
                success: success,
                message: message || "yey"
            });

            response.writeHead(200, {
                'Content-Type': 'application/json',
                'Content-Length': body.length
            });

            response.write(body);
            response.end();
        }

        /* File not found (404) */
        else {
            var body = 'File not found';
            response.writeHead(404, {
                'Content-Type': 'text/plain',
                'Content-Length': body.length
            });

            response.write(body);
            response.end();
            console.log ('[*] Macchiato: The file "%s" was not found.', filePath);
        }
    }).listen(this.port);
}

/**
 * exitHandler
 * - Kicks in on sigint (synchronous only)
 */
Macchiato.prototype.sigintHandler = function () {
    //process.on('SIGINT', function () {
    //    console.log(code);
        //console.log('[*] Macchiato: Goodbye!');
    //});
}


/**
 * Program
 * - Transforms first argument speaker to a coffee shop
 */
var macchiato = new Macchiato ();
var play3 = new Sonos (process.argv[2]);
macchiato.addSpeaker(play3);


play3.getPositionInfo(function (data) {
    console.log(data['TrackDuration']);
    console.log(data['RelTime']);
});



//macchiato.transformIntoCoffeeShop();
