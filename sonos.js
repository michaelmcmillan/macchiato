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

    var body = this.soap (service, action, argument);
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
      // Set charset
      res.setEncoding('utf8');

      // Buffer response
      var data = [];
      res.on('data', function (chunk) {
          data.push(chunk);
      });

      // When request is finished
      res.on('end', function () {
          data = data.join('');

          if (callback)
            // Parse response
            xml2js.parseString(data, function (err, result) {
                if (!err)
                    callback(result['s:Envelope']['s:Body']);
                else
                    console.log ('[*] uPnP: Error on ' + action, err);
            });
      });
    });

    // Write to request body
    req.write(body);
    req.end();
}

/**
 * void play
 * - Emulates the play-button
 */
Sonos.prototype.play = function (callback) {

    this.request(
        '/MediaRenderer/AVTransport/Control',
        'urn:schemas-upnp-org:service:AVTransport:1',
        'Play',
        '<InstanceID>0</InstanceID><Speed>1</Speed>',
        callback
    );

}

/**
 * string pause
 * - Emulates the pause-button
 */
Sonos.prototype.pause = function (callback) {

    this.request(
        '/MediaRenderer/AVTransport/Control',
        'urn:schemas-upnp-org:service:AVTransport:1',
        'Pause',
        '<InstanceID>0</InstanceID><Speed>1</Speed>',
        callback
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
 * - Sets the queue with a uri and callbacks when complete
 */
Sonos.prototype.setQueue = function (uri, callback) {
    this.request(
        '/MediaRenderer/AVTransport/Control',
        'urn:schemas-upnp-org:service:AVTransport:1',
        'SetAVTransportURI',
        '<InstanceID>0</InstanceID><CurrentURI>'+ uri +
        '</CurrentURI><CurrentURIMetaData></CurrentURIMetaData>',
        callback
    );
}

/**
 * Object getPositionInfo
 * - Retrives metadata for track
 */
Sonos.prototype.getPositionInfo = function (callback) {
    this.request(
        '/MediaRenderer/AVTransport/Control',
        'urn:schemas-upnp-org:service:AVTransport:1',
        'GetPositionInfo',
        '<InstanceID>0</InstanceID>',
        function (response) {
            callback(response[0]['u:GetPositionInfoResponse'][0]);
        }
    );
}
