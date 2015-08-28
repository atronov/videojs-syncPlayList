var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    fs = require("fs"),
    uuid = require("uuid"),
    playlist = require("./routes/playlist");

var app = express();

// в эту папку собирает gulp
app.use(express.static(path.join(__dirname, 'public')));

// тут лежат видео-файлы
app.use("/video", express.static(path.join(__dirname, "video")));

app.get('/', express.static("/index.html"));

playlist.init();
app.use(playlist);

module.exports = app;
