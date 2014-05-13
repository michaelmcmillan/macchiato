var http = require('http');
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
Sonos.prototype.request = function (path, service, action, argument) {

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

    var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log(action);
      });
    });

    req.write(body);
    req.end();
}

/**
 * play
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
 * pause
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
 * setVolume
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
 * setQueue
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

    setTimeout(callback, 2000);
}
