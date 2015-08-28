/**
 * Created by vkusny on 16.08.15.
 */
var gulp = require("gulp"),
    path = require("path"),
    rename = require("gulp-rename");

var src = "client";
var dst = "public";

gulp.task("default", ["build"]);

gulp.task("build", ["html", "js", "lib"]);

gulp.task("html", function() {
    gulp.src(path.join(src,"*.html"))
        .pipe(gulp.dest(dst));
});

gulp.task("js", function() {
    var jsDstPath = path.join(dst,"js");
    gulp.src(path.join(src,"js/*.js"))
        .pipe(gulp.dest(jsDstPath));
});

gulp.task("lib", function() {
    gulp.src([
        "bower_components/videojs-playList/dist/*",
        "bower_components/promise/promise.js",
        ])
        .pipe(rename({ dirname: "." }))
        .pipe(gulp.dest(path.join(dst, "lib")));
})

gulp.task("watch", function() {
    gulp.watch(path.join(src,"*.html"), ["html"]);
    gulp.watch(path.join(src,"**/*.js"), ["js"]);
})