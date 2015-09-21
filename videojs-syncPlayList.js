/**
 * Created by vkusny on 21.09.15.
 */
// requires Promise, videojs-playList

/**
 * Play list for videojs which is updated automatically from the server via long-polling
 * @param {Object} options	Configures plagin
 * @param {(number|string)}	options.playListId Id of the play list from server
 * @param {string} 			[options.httpMethod=GET] http method to get play list
 * @param {string} 			[options.httpPath=/pl] http path to get play list
 * @param {string} 			[options.idParamName=id] Param name of play list ID into http request
 * @param {string} 			[options.sinceParamName=since] Param name for server time into http request
 * @return {Promise} Fullfill when first play list has been loaded
 */
function syncPlayList(options) {
    'use strict';

    var player = this;

    checkOptions(options);
    return init(options);

    function init(options) {
        var serverTime;
        var id  = options.playListId;
        return getList(id).then(function(res) {
            res = JSON.parse(res);
            serverTime = Number(res.servertime);
            var videos = res.videos;
            player.playList(videos, {
                getVideoSource: options.getVideoSouece && options.getVideoSouece.bind(player)
            });
            var updatePlayList = function() {
                getList(id, serverTime).then(function(newRes) {
                    newRes = JSON.parse(newRes);
                    serverTime = Number(newRes.servertime);
                    var videos = newRes.videos;
                    player.updatePlayList(videos);
                }).catch(function(er) {
                    console.error(er);
                }).then(updatePlayList);
            };
            updatePlayList();
            return player;
        });
    }

    function checkOptions(options) {
        if (!options.playListId && options.playListId !== 0) {
            throw new Error("options.playListId required");
        }
    }

    function getList(id, since) {
        var idParamName = options.idParamName || "id";
        var sinceParamName = options.sinceParamName || "since";
        var method = options.httpMethod || "GET";
        var path = options.httpPath || "/pl";

        var params = {};
        params[idParamName] = id;
        if (since) {
            params[sinceParamName] = since;
        }
        return http(method, path, params);
    }

    function http(method, path, params) {
        return new Promise(function(resolve, reject) {
            var request = getXmlHttp();
            var data = null;
            if (params) {
                if (method === "GET") {
                    path += "?" + buildParamsString(params);
                } else {
                    data = buildParamsString(params);
                }
            }
            request.open(method, path, true);
            request.addEventListener("load", function() {
                if (request.status == 200) {
                    resolve(request.responseText);
                } else {
                    console.error("Request", path, "has ended with status", request.status);
                }
            });
            request.send(data);
        });
    }

    function buildParamsString(params) {
        var paramPairs = [];
        for (var paramKey in params) {
            if (params.hasOwnProperty(paramKey)) {
                paramPairs.push(encodeURIComponent(paramKey)+"="+encodeURIComponent(params[paramKey]));
            }
        }
        return paramPairs.join("&");
    }

    function getXmlHttp() {
        var xmlhttp;
        try {
            xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (E) {
                xmlhttp = false;
            }
        }
        if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
            xmlhttp = new XMLHttpRequest();
        }
        return xmlhttp;
    }
}

videojs.plugin('syncPlayList', syncPlayList);