![alt text](logo.png) Macchiato
================

Macchiato is a node.js application which turns your Sonos speakers into a coffe
shop. It is meant for those who prefer to code with non-disturbing background
noise.

### Install & use
```shell
git clone https://github.com/michaelmcmillan/macchiato
node macchiato/macchiato.js 192.168.1.229
```
Macchiato only takes one argument: The ip address of the speaker you want to use.

### Under the hood
By using node's bundled http-library it is pretty easy to communicate with devices
from Sonos. I started out by Wiresharking the network to reverse engineer the protocol.
This was far from necessary due to blog posts like [this](http://www.hirahim.com/blog/2012/04/29/dissecting-the-sonos-controller/).
It turns out each speaker acts as a uPnP endpoint.

Macchiato spins up a static file server each time you run it on port 1337. The speakers
then stream the audio files straight from Macchiato. This has several benefits:
You can add your own audio files (rainy mood etc.) and you it will still work
without an internet connection.

### To-do
* Improve the user experience
* Use an xml-lib to create the Soap-requests.
* Feature: Choose from a set of sounds.
* Feature: Scan the network for speakers/zones.
* Feature: Adjust volume from the command line.
* Bug: Repeat when file is finished.

### References
* [Coffitivity](http://coffitivity.com/) - An awesome app we borrow the audio from.
* [node-sonos](https://github.com/bencevans/node-sonos/blob/master/lib/sonos.js) - Insight into the uPnP protocol with Sonos.
* [Dissecting the Sonos Controller](http://www.hirahim.com/blog/2012/04/29/dissecting-the-sonos-controller/) - Reverse engineering Sonos.
