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

gulp.task('build:AboutMeData', function() {
  gulp.src('./bin/images/aboutMe/**/*.{png,mov,mpg}')
  .pipe(buffer())
  .pipe(es.map(function (file, cb) {
      var title = path.basename(file.relative);
      //  title = title.substring(2).replace(/_/g, " ");
      title = title.substring(0, title.length - 4); //remove fileExtension
      var dimensions = sizeOf(file.contents);

      var regExp = /\(([^)]+)\)/;
      var matches = regExp.exec(title);
      var json = {
        src: "images/aboutMe/",
        name: title,
        dimensions: dimensions,
        linkUrl: matches[1],
      };

      file.contents = new Buffer(JSON.stringify(json) + ",");
      return cb(null, file);
     }))
  .pipe(concat("aboutMeData.js"))
  .pipe(insert.wrap("module.exports = [", "];"))
  .pipe(gulp.dest('./src/js/data/pageData'));
});
