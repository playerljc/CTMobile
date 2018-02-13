var gulp = require('gulp');
var autoprefixer = require("gulp-autoprefixer");
var concat = require("gulp-concat");
var concatCss = require("gulp-concat-css");
var cssnano = require("gulp-cssnano");
var eslint = require("gulp-eslint");
var imagemin = require("gulp-imagemin");
var less = require("gulp-less");
var livereload = require("gulp-livereload");
var rename = require("gulp-rename");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var watch = require("gulp-watch");
var clean = require("gulp-clean");

var jsPaths = [
  "../adapter/jquery-2.2.0.min.js",
  "../adapter/hashmap.js",
  "../adapter/tool.js",
  "src/angular/directive/angulardirectivemanager.js",
  "src/angular/filter/angularfiltermanager.js",
  "src/angular/service/angularservicemanager.js",
  "src/ctmobile.js"
];

gulp.task("script", function () {
  return gulp.src(jsPaths)
    .pipe(concat("ctmobile.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist"))
    .pipe(livereload());
});

gulp.task("style", function () {
  return gulp.src("src/ctmobile.css")
    .pipe(autoprefixer())
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest("dist"))
    .pipe(livereload());
});

gulp.task("clean", function () {
  return gulp.src("dist").pipe(clean());
});

gulp.task("default", ["clean"], function () {
  gulp.start("script", "style");
});

gulp.task('watch', function () {
  livereload.listen(); //要在这里调用listen()方法
  gulp.watch('src/ctmobile.css', ['style']);
  gulp.watch('src/angular/**/*.js', ["script"]);
  gulp.watch('src/ctmobile.js', ["script"]);
});
