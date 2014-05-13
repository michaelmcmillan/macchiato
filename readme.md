![alt text](logo.png) Macchiato
================

Macchiato is a node.js application which turns your Sonos speakers into a coffe
shop. It is meant for those who prefer to code with non-disturbing background
noise.

### Usage
```shell
node macchiato.js 192.168.1.229
```
Macchiato only takes one argument: The ip address of the speaker you want to use.

### The protocol
By using node's bundled http-library it is pretty easy to communicate with devices
from Sonos. I started out by Wiresharking the network to reverse engineer the protocol.
This was far from necessary due to blog posts like [this](http://www.hirahim.com/blog/2012/04/29/dissecting-the-sonos-controller/).
It turns out each speaker acts as a uPnP endpoint.

### To-do
* Improve the user experience
* Use an xml-lib to create the Soap-requests.
* Feature: Choose from a set of sounds.
* Feature: Scan the network for speakers/zones.
* Feature: Adjust volume from the command line.
* Bug: Repeat when file is finished.

### Credits
* [Coffitivity](http://vg.no) - An awesome app we borrow the audio from.
* [node-sonos](https://github.com/bencevans/node-sonos/blob/master/lib/sonos.js) - Insight into the uPnP protocol with Sonos.
