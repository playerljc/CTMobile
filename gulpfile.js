var gulp = require('gulp')
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");

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

gulp.task("minjs", function () {
  return gulp.src([
    "lib/BorasdCast.js",
    "lib/Constant.js",
    "lib/CtMobile.js",
    "lib/index.js",
    "lib/Page.js",
    "lib/Router.js",
  ])
    .pipe(concat("ctmobile.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("lib"))
});

gulp.task('default', ['less', 'copy'/*, 'minjs'*/]);
