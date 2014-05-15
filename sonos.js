var http = require('http');
var xml2js = require('xml2js');
module.exports = Sonos;

/**
 * Sonos
 * - A sonos device (Play:*)
 */
function Sonos (ip, port) {
    this.ip = ip;
    this.port = port || 1400;
}

/**
 * soap
 * - Builds a soap-body for uPnP-protocol
 */
Sonos.prototype.soap = function (service, action, argument) {

    return [
        '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/"',
        's:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">',
            '<s:Body>',
                '<u:'+ action +' xmlns:u="'+ service +'">',
                    argument,
                '</u:'+ action +'>',
            '</s:Body>',
        '</s:Envelope>'].join('\n');
}

/**
 * request
 * - Sends the soap request to the device
 */
Sonos.prototype.request = function (path, service, action, argument, callback) {

    var body = this.soap(service, action, argument);
    var options = {
          hostname: this.ip,
          port: this.port,
          path: path,
          method: 'POST',
          headers: {
            'Content-type': 'text/xml; charset="utf-8"',
            'SoapAction': '"'+ service +'#'+ action +'"',
            'Content-length': body.length
          }
    };

    var req = http.request(options, function (res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {

          // Spit back soap-response to cb
          if (callback)
            xml2js.parseString(chunk, function (err, result) {
                if (!err) callback(result['s:Envelope']['s:Body']);
            });

          console.log ('[*] uPnP: ' + action);
      });
    });

    req.write(body);
    req.end();
}

/**
 * void play
 * - Emulates the play-button
 */
Sonos.prototype.play = function () {

    this.request(
        '/MediaRenderer/AVTransport/Control',
        'urn:schemas-upnp-org:service:AVTransport:1',
        'Play',
        '<InstanceID>0</InstanceID><Speed>1</Speed>'
    );

}

/**
 * string pause
 * - Emulates the pause-button
 */
Sonos.prototype.pause = function () {

    this.request(
        '/MediaRenderer/AVTransport/Control',
        'urn:schemas-upnp-org:service:AVTransport:1',
        'Pause',
        '<InstanceID>0</InstanceID><Speed>1</Speed>'
    );

}

/**
 * void setVolume
 * - Sets the volume (0-100)
 */
Sonos.prototype.setVolume = function (volume) {

    this.request(
        '/MediaRenderer/RenderingControl/Control',
        'urn:schemas-upnp-org:service:RenderingControl:1',
        'SetVolume',
        '<InstanceID>0</InstanceID><Channel>Master</Channel>'+
        '<DesiredVolume>'+volume+'</DesiredVolume>'
    );

}

/**
 * Int getVolume
 * - Gets the volume (0-100)
 */
Sonos.prototype.getVolume = function (callback) {
    this.request(
        '/MediaRenderer/RenderingControl/Control',
        'urn:schemas-upnp-org:service:RenderingControl:1',
        'GetVolume',
        '<InstanceID>0</InstanceID><Channel>Master</Channel>',
        function (response) {
            callback(parseInt(
                response[0]['u:GetVolumeResponse']
                        [0]['CurrentVolume'])
            );
        }
    );
}

/**
 * void setQueue
 * - Sets the queue with a uri and callbacks after 2000ms
 */
Sonos.prototype.setQueue = function (uri, callback) {

    this.request(
        '/MediaRenderer/AVTransport/Control',
        'urn:schemas-upnp-org:service:AVTransport:1',
        'SetAVTransportURI',
        '<InstanceID>0</InstanceID><CurrentURI>'+ uri +
        '</CurrentURI><CurrentURIMetaData></CurrentURIMetaData>'
    );

    // This is not very stable.
    setTimeout(callback, 2000);
}
