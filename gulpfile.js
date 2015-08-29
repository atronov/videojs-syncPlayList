/**
 * Created by vkusny on 16.08.15.
 */
var gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename");

var dst = "dist",
    jsFileName = "videojs-syncPlayList.js",
    minFileName = "videojs-syncPlayList.min.js",
    bundleFileName = "videojs-syncPlayList.bundle.js";

gulp.task("default", ["build"]);

gulp.task("build", ["dev", "min", "bundle"]);

gulp.task("dev", function() {
    gulp.src(jsFileName)
        .pipe(gulp.dest(dst));
});

gulp.task("min", function() {
    gulp.src(jsFileName)
        .pipe(uglify())
        .pipe(rename(minFileName))
        .pipe(gulp.dest(dst));
});

gulp.task("bundle", function() {
    gulp.src([
            "bower_components/videojs-playList/dist/videojs-playlists.js",
            "bower_components/promise/promise.js",
            jsFileName
        ])
        .pipe(uglify())
        .pipe(concat(bundleFileName))
        .pipe(gulp.dest(dst));
})