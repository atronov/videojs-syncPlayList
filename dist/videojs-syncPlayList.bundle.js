function syncPlayList(t){"use strict";function e(t){var e,n=t.playListId;return r(n).then(function(i){i=JSON.parse(i),e=Number(i.servertime);var s=i.videos;a.playList(s),t.onListCreated&&t.onListCreated(a);var o=function(){r(n,e).then(function(t){t=JSON.parse(t),e=Number(t.servertime);var n=t.videos;a.updatePlayList(n)})["catch"](function(t){console.error(t)}).then(o)};return o(),a})}function n(t){if(!t.playListId&&0!==t.playListId)throw new Error("options.playListId required")}function r(e,n){var r=t.idParamName||"id",s=t.sinceParamName||"since",o=t.httpMethod||"GET",a=t.httpPath||"/pl",u={};return u[r]=e,n&&(u[s]=n),i(o,a,u)}function i(t,e,n){return new Promise(function(r,i){var a=o(),u=null;n&&("GET"===t?e+="?"+s(n):u=s(n)),a.open(t,e,!0),a.addEventListener("load",function(){200==a.status?r(a.responseText):console.error("Request",e,"has ended with status",a.status)}),a.send(u)})}function s(t){var e=[];for(var n in t)t.hasOwnProperty(n)&&e.push(encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e.join("&")}function o(){var t;try{t=new ActiveXObject("Msxml2.XMLHTTP")}catch(e){try{t=new ActiveXObject("Microsoft.XMLHTTP")}catch(n){t=!1}}return t||"undefined"==typeof XMLHttpRequest||(t=new XMLHttpRequest),t}var a=this;return n(t),e(t)}videojs.plugin("syncPlayList",syncPlayList);