function playList(e,t){var r=this;r.pl=r.pl||{};var o=parseInt(e,10);r.pl._guessVideoType=function(e){var t={webm:"video/webm",mp4:"video/mp4",ogv:"video/ogg"},r=e.split(".").pop();return t[r]||""},r.pl.init=function(e,t){t=t||{},r.pl.videos=[],r.pl.current=0,r.on("ended",r.pl._videoEnd),t.getVideoSource&&(r.pl.getVideoSource=t.getVideoSource),r.pl._addVideos(e)},r.pl._updatePoster=function(e){r.poster(e),r.removeChild(r.posterImage),r.posterImage=r.addChild("posterImage")};var p=function(e,t){for(var r=0;r<e.length;r++)for(var o=0;o<t.length;o++)if(e[r]&&t[o]&&e[r].src===t[o].src)return!0;return!1};return r.pl._createVideoItem=function(e){for(var t=Object.create(e),o=[],p=0,i=t.src.length;i>p;p++)o.push({type:r.pl._guessVideoType(t.src[p]),src:t.src[p]});return t.src=o,t},r.pl._addVideos=function(e){for(var t=0,o=e.length;o>t;t++){var p=r.pl._createVideoItem(e[t]);r.pl.videos.push(p)}},r.pl._updateVideos=function(e){var t=r.pl.currentVideo,o=e.some(function(e,o){var i=r.pl._createVideoItem(e);return p(t.src,i.src)?(r.pl.current=o,!0):!1});o||r.pl.current>=e.length&&(r.pl.current=e.length-1),r.pl.videos=[],r.pl._addVideos(e)},r.pl._nextPrev=function(e){var t,o;if("next"===e?(t=r.pl.videos.length-1,o=1):(t=0,o=-1),r.pl.current!==t){var p=r.pl.current+o;r.pl._setVideo(p),r.trigger(e,[r.pl.videos[p]])}},r.pl._setVideo=function(e){e<r.pl.videos.length&&(r.pl.current=e,r.pl.currentVideo=r.pl.videos[e],r.paused()||r.pl._resumeVideo(),r.pl.getVideoSource?r.pl.getVideoSource(r.pl.videos[e],function(e,t){r.pl._setVideoSource(e,t)}):r.pl._setVideoSource(r.pl.videos[e].src,r.pl.videos[e].poster))},r.pl._setVideoSource=function(e,t){r.src(e),r.pl._updatePoster(t)},r.pl._resumeVideo=function(){r.one("loadstart",function(){r.play()})},r.pl._videoEnd=function(){r.pl.current===r.pl.videos.length-1?r.trigger("lastVideoEnded"):(r.pl._resumeVideo(),r.next())},e instanceof Array?(r.pl.init(e,t),r.pl._setVideo(0),r):o===o?(r.pl._setVideo(o),r):"string"==typeof e&&"undefined"!=typeof r.pl[e]?(r.pl[e].apply(r),r):void 0}videojs.Player.prototype.next=function(){return this.pl._nextPrev("next"),this},videojs.Player.prototype.prev=function(){return this.pl._nextPrev("prev"),this},videojs.Player.prototype.updatePlayList=function(e){return this.pl._updateVideos(e),this},videojs.plugin("playList",playList);
(function(){"use strict";var e=function(){this.thenTargets=[],this.pending=!0},t=function(t){return t&&t instanceof e},n=function(e){return e&&"function"==typeof e.then};e.prototype.resolve=function(e,i){if(e===i)throw new TypeError("resolve: arguments cannot be the same object");if(e===i)throw new TypeError("resolve: arguments cannot be the same object");t(i)||n(i)?i.then(e.fulfil.bind(e),e.reject.bind(e)):e.fulfil(i)},e.prototype.handleThenTargets=function(){var e,t,n,i;for(i=0;i<this.thenTargets.length;++i){this.fulfilled&&(t=this.thenTargets[i].onFulfilled,n=this.value),this.rejected&&(t=this.thenTargets[i].onRejected,n=this.reason);try{e=t&&"function"==typeof t?t.apply(void 0,n):this,this.resolve(this.thenTargets[i],e)}catch(h){this.thenTargets[i].reject(h)}}this.thenTargets=[]},e.prototype.handleThen=function(){this.pending||this.handleThenTargets()},e.prototype.then=function(t,n){var i=new e;return i.onFulfilled=t,i.onRejected=n,this.thenTargets.push(i),setTimeout(this.handleThen.bind(this),0),i},e.prototype.fulfil=function(){this.rejected||(this.fulfilled=!0,this.pending=!1,this.value=arguments,this.handleThenTargets())},e.prototype.reject=function(){this.fulfilled||(this.reason=arguments,this.rejected=!0,this.pending=!1,this.handleThenTargets())},this.Promise=e}).call(this);
function syncPlayList(t){"use strict";function e(t){var e,n=t.playListId;r(n).then(function(i){i=JSON.parse(i),e=Number(i.servertime);var s=i.videos;a.playList(s),t.onListCreated&&t.onListCreated(a);var o=function(){r(n,e).then(function(t){t=JSON.parse(t),e=Number(t.servertime);var n=t.videos;a.updatePlayList(n)})["catch"](function(t){console.error(t)}).then(o)};o()})}function n(t){if(!t.playListId&&0!==t.playListId)throw new Error("options.playListId required")}function r(e,n){var r=t.idParamName||"id",s=t.sinceParamName||"since",o=t.httpMethod||"GET",a=t.httpPath||"/pl",c={};return c[r]=e,n&&(c[s]=n),i(o,a,c)}function i(t,e,n){return new Promise(function(r,i){var a=o(),c=null;n&&("GET"===t?e+="?"+s(n):c=s(n)),a.open(t,e,!0),a.addEventListener("load",function(){200==a.status?r(a.responseText):console.error("Request",e,"has ended with status",a.status)}),a.send(c)})}function s(t){var e=[];for(var n in t)t.hasOwnProperty(n)&&e.push(encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e.join("&")}function o(){var t;try{t=new ActiveXObject("Msxml2.XMLHTTP")}catch(e){try{t=new ActiveXObject("Microsoft.XMLHTTP")}catch(n){t=!1}}return t||"undefined"==typeof XMLHttpRequest||(t=new XMLHttpRequest),t}var a=this;n(t),e(t)}videojs.plugin("syncPlayList",syncPlayList);