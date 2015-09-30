# About
Plugin for [video.js](https://github.com/videojs/video.js) which allows to synchronize play-list from server.
When play-list is changed, it must push client via long polling, and the list will be updated automatically.

# Usage
```javascript
// create video.js element
var player = videojs(options.element);
// add plugin
player.syncPlayList({
	httpPath: "/playList", // url-path of http-request to get play-list
	playListId: 100500 // identifier of current play =-list on server, will be sent as parameter
})
.then(function(player) { // callback on play-list loaded from server first time
	console.log("Play-list has been loaded");
});

```
There are many other options that make using of this plugin very flexible.
They are [described in code as JSDoc](/videojs-syncPlayList.js).

Certainly current example will make GET http-request
```
http://youserver/playList?id=100500
```
Server must response with JSON structure
```javascript
{
	serverTime: 1443648042244, // seconds of server time
	videos: { ... } // structure for videojs-playLists plugin, described here https://github.com/jgallen23/videojs-playLists#initialize-playlist
}
```
Then client will make http-request to get play-list updates
```
http://youserver/playList?id=100500&since=1443648042244
```
and so on.

[Using with server](https://github.com/atronov/videojs-syncPlayListServer) on nodejs & express.

# Manual downoad
[videojs-syncPlayList.js](https://raw.githubusercontent.com/atronov/videojs-syncPlayList/master/dist/videojs-syncPlayList.js) - dev-version;<br/>
[videojs-syncPlayList.min.js](https://raw.githubusercontent.com/atronov/videojs-syncPlayList/master/dist/videojs-syncPlayList.min.js) - minified prod-version;<br/>
[videojs-syncPlayList.bundle.js](https://raw.githubusercontent.com/atronov/videojs-syncPlayList/master/dist/videojs-syncPlayList.bundle.js) - dev-version with all dependencies.

# Dependencies
[video.js](https://github.com/videojs/video.js/) - of course.<br/>
[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) - any stable implementation. I recomend native implementation or [bluebird](https://github.com/petkaantonov/bluebird). Tested with them.<br/>
[videojs-playLists](https://github.com/atronov/videojs-playLists) - definitely this fork. Original implementation doesn't allow updating.

# bower
```
bower install --save git@github.com:atronov/videojs-syncPlayList.git
```
It will install all needed dependencies except video.js.

# Build
```
npm install && gulp
```
It recreates js-files in dist folder. These files are described in (manual download)[#manual-downoad].
