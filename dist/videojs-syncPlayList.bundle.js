function syncPlayList(e){"use strict";function t(e){var t,n=e.playListId;return r(n).then(function(i){i=JSON.parse(i),t=Number(i.servertime);var o=i.videos;a.playList(o,{getVideoSource:e.getVideoSouece&&e.getVideoSouece.bind(a)});var s=function(){r(n,t).then(function(e){e=JSON.parse(e),t=Number(e.servertime);var n=e.videos;a.updatePlayList(n)})["catch"](function(e){console.error(e)}).then(s)};return s(),a})}function n(e){if(!e.playListId&&0!==e.playListId)throw new Error("options.playListId required")}function r(t,n){var r=e.idParamName||"id",o=e.sinceParamName||"since",s=e.httpMethod||"GET",a=e.httpPath||"/pl",u={};return u[r]=t,n&&(u[o]=n),i(s,a,u)}function i(e,t,n){return new Promise(function(r,i){var a=s(),u=null;n&&("GET"===e?t+="?"+o(n):u=o(n)),a.open(e,t,!0),a.addEventListener("load",function(){200==a.status?r(a.responseText):console.error("Request",t,"has ended with status",a.status)}),a.send(u)})}function o(e){var t=[];for(var n in e)e.hasOwnProperty(n)&&t.push(encodeURIComponent(n)+"="+encodeURIComponent(e[n]));return t.join("&")}function s(){var e;try{e=new ActiveXObject("Msxml2.XMLHTTP")}catch(t){try{e=new ActiveXObject("Microsoft.XMLHTTP")}catch(n){e=!1}}return e||"undefined"==typeof XMLHttpRequest||(e=new XMLHttpRequest),e}var a=this;return n(e),t(e)}videojs.plugin("syncPlayList",syncPlayList);