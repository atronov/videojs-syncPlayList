/**
 * Created by vkusny on 16.08.15.
 */
function play(options, callBack) {
    checkOptions(options);
    var servertime;
    var id  = options.playListId;
    getList(id).then(function(res) {
        res = JSON.parse(res);
        servertime = Number(res.servertime);
        var videos = res.videos;
        var player = createPlayer(options, videos);
        var updatePlayList = function() {
            getList(id, servertime).then(function(newRes) {
                newRes = JSON.parse(newRes);
                servertime = Number(newRes.servertime);
                var videos = newRes.videos;
                player.updatePlayList(videos);
            }).catch(function(er) {
                console.error(er);
            }).then(updatePlayList);
        };
        updatePlayList();
    });
}

function checkOptions(options) {
    if (!options.playListId && options.playListId !== 0) {
        throw new Error("options.playListId required");
    }
    if (!options.element) {
        throw new Error("options.element required");
    }
}

function createPlayer(options, videos) {
    var player = videojs(options.element);
    player.playList(videos);
    options.prevButton && options.prevButton.addEventListener("click", player.prev.bind(player));
    options.nextButton && options.nextButton.addEventListener("click", player.next.bind(player));
    return player;
}

function getList(id, since) {
    var params = { id: id };
    if (since) {
        params.since = since;
    }
    return http("GET", "/pl", params);
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
