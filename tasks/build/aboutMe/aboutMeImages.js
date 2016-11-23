var gulp = require('gulp');
var map = require('map-stream');
var vfs = require('vinyl-fs');
// var jsonTransform = require('gulp-json-transform')
var concat = require("gulp-concat");
var insert = require("gulp-insert");
var es = require("event-stream");
var path = require("path");
var buffer = require("gulp-buffer");
var sizeOf = require('image-size');

var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize')

gulp.task('build:AboutMeImages', function() {
  gulp.src('./src/images/aboutMe/**/*.{png,mov,mpg}')
  .pipe(imagemin({ progressive: true }))
  .pipe(imageResize({
      width: 300,
      background: "#FFFFFF"
    }))
  .pipe(gulp.dest('./bin/images/aboutMe'));
});
