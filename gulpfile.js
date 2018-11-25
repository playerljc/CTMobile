var gulp = require('gulp');
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var clean = require('gulp-clean');

gulp.task('less', function () {
  var less = require('gulp-less');
  var postcss = require('gulp-postcss');
  var replace = require('gulp-replace');

  gulp.src('src/**/*.less')
    .pipe(
      postcss([require('postcss-for'), require('autoprefixer')({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9', // React doesn't support IE8 anyway
        ]
      })]))
    .pipe(less())
    .pipe(gulp.dest('lib'));

  gulp.src('lib/**/*.js')
    .pipe(replace('.less', '.css'))
    .pipe(gulp.dest('lib'))
});

gulp.task('copy', function () {
  gulp.src('src/**/*.png')
    .pipe(gulp.dest('lib'))
});

gulp.task("garbleuglify", function () {
  return gulp.src([
    'lib/src/*.js'
  ])
    .pipe(uglify())
    .pipe(gulp.dest("lib"))
});

gulp.task("garble", ['garbleuglify'], function () {
  gulp.src("lib/src").pipe(clean());
});

gulp.task("umd", ['umdparse'], function () {
  gulp.src("umd/src").pipe(clean());
});

gulp.task("umdparse", function () {
  return gulp.src([
    'umd/src/Constant.js',
    'umd/src/BorasdCast.js',
    'umd/src/Router.js',
    'umd/src/Page.js',
    'umd/src/CtMobile.js',
    'umd/src/index.js'
  ])
    .pipe(concat("ctmobile.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("umd"))
});

gulp.task('default', ['less', 'copy', 'garble']);
