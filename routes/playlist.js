'use strict';

var express = require("express"),
	fs = require("fs"),
	Promise = require("promise"),
	fsmon = require('fsmonitor'),
	path = require('path');

var router = express.Router();

var listsDir = "lists"
var observationTimeout = 600000; // не используется сейчас
var waiterTimeout = 30000;

// списки за которыми наблюдаем
var observable = {};
// запросы на изменения списков
var waiters= {};
// последнее изменение списка
var lastChange = {};

router.get("/pl", function(req, res) {
	var id = req.query.id;
	markObservation(id);
	if (req.query.since) {
		// если указано время последнего изменения
		var since = Number(req.query.since);
		if (!lastChange[id] || lastChange[id] > since) {
			getList(id)
				.then(sendList.bind(null, res, id))
				.catch(handleError.bind(null, res));
		} else {
			addWaiter(id, res);
		}
	} else {
		getList(id)
			.then(sendList.bind(null, res, id))
			.catch(handleError.bind(null, res));
	}
});

function handleError(res, error) {
	var message = error;
	var status = 500;
	console.error(error);
	if (error.code === "ENOENT") {
		status = 404;
		message = "No list with such id";
	}
	res = (Array.isArray(res))? res : [ res ];
	res.forEach(function(r) {
		r.status(status).send(message);
	});
};

function init() {
	var startTime = Date.now();
	fs.readdir(listsDir, function(error, files) {
		if (error) {
			console.error("Error while listing files", error);
			throw new Error(error);
		}
		files.forEach(function(file) {
			lastChange[fileToId(file)] = startTime;
		})
		startMon();
	});
};

function addWaiter(id, res) {
	if (!waiters[id]) {
		waiters[id] = [];
	}
	waiters[id].push(res);
	setTimeout(function() {
		if (waiters[id] && waiters[id].length) {
			var waiterInd = waiters[id].indexOf(res);
			if (waiterInd !== -1) {
				getList(id)
					.then(sendList.bind(null, res, id))
					.catch(handleError.bind(null, res));
				waiters[id].splice(waiterInd, 1);
			}
		}
	}, waiterTimeout);
}

function markObservation(id) {
	observable[id] = true;
}

function startMon() {
	fsmon.watch(listsDir, null, function(change) {
		setTimeout(function() {
			change.addedFiles.forEach(function(file) {
				var listId = fileToId(file);
				lastChange[listId] = Date.now();
			});
			change.removedFiles.forEach(function(file) {
				var listId = fileToId(file);
				if (observable[listId]) {
					triggerRemove(listId);
				}
			});
			change.modifiedFiles.forEach(function(file) {
				var listId = fileToId(file);
				if (observable[listId]) {
					triggerChange(listId);	
				}
			});
		}.bind(null, change), 1000);
	});
}

function triggerChange(id) {
	lastChange[id] = Date.now();
	if (waiters[id] && waiters[id].length) {
		getList(id).then(function(data) {
			var responseText = createResponseText(id, data);
			waiters[id].forEach(function(res) {
				res.send(responseText);
			});
		})
		.catch(handleError.bind(null, waiters[id]))
		.then(function() {
			waiters[id] = [];
		});
	}
};

function triggerRemove(id) {
	lastChange[id] = Date.now();
	if (waiters[id] && waiters[id].length) {
		var emptyListText = createResponseText(id, []);
		waiters[id].forEach(function(res) { res.send(emptyListText); });
		delete waiters[id];
	}
	delete observable[id];
	delete lastChange[id];
} 

function getList(id) {
	return new Promise(function(accept, reject) {
		var listPath = path.join(listsDir, idToFile(id));
		fs.readFile(listPath, { encoding: "utf8" }, function(error, data) {
			if (error) {
				reject(error);
			} else {
				accept(data);
			}
		});
	});	
};

function sendList(res, id, data) {
	res.send(createResponseText(id, data));
}

function createResponseText(id, data) {
	var servertime = lastChange[id] || Date.now();
	var videos = (Array.isArray(data))? data: JSON.parse(data);
	var result = {
		videos: videos,
		servertime: servertime	
	};
	return JSON.stringify(result);
};


function fileToId(fileName) {
	return path.parse(fileName).name;
};

function idToFile(id) {
	return id+".json";
}

router.init = init;
module.exports = router;