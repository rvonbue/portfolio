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

var log = function(file, cb) {
  console.log(file.contents);
  cb(null, file);
};


gulp.task('build:AboutMeData', function() {
  gulp.src('./bin/images/aboutMe/**/*.{jpg,mov,mpg}')
  .pipe(buffer())
  .pipe(es.map(function (file, cb) {
         var title = path.basename(file.relative);
        //  title = title.substring(2).replace(/_/g, " ");
         title = title.substring(0, title.length - 4); //remove fileExtension
        var dimensions = sizeOf(file.contents);
         var json = {
           src: "images/aboutMe/",
           name: title,
           dimensions: dimensions
          //  path: file.contents.toString(),
         };
         file.contents = new Buffer(JSON.stringify(json) + ",");
         return cb(null, file);
     }))
  .pipe(concat("aboutMeData.js"))
  .pipe(insert.wrap("module.exports = [", "];"))
  .pipe(gulp.dest("client/src/js/data"))
  .pipe(gulp.dest('./src/js/data/pageData'));
});

//
// var gulp = require("gulp");
// var map = require("map-stream");

// var path = require("path");
// var xml2js = require("gulp-xml2js");
// var buffer = require("gulp-buffer");
// var es = require("event-stream");
// var size = require("gulp-size");
//
// gulp.task("build:js:examples", function () {
//
//   return gulp.src("client/src/examples/**/*.gexf")
//     .pipe(xml2js())
//     .pipe(buffer())
//      .pipe(es.map(function (file, cb) {
//         var title = path.basename(file.relative);
//         title = title.substring(2).replace(/_/g, " ");
//         title = title.substring(0, title.length - 3);
//         var json = {
//           title: title,
//           code: file.contents.toString(),
//         };
//         file.contents = new Buffer(JSON.stringify(json) + ",");
//         return cb(null, file);
//     }))
//     .pipe(concat("exampleList.js"))
//     .pipe(insert.wrap("module.exports = [", "];"))
//     .pipe(gulp.dest("client/src/js/data"))
//     .pipe(size({
//       showFiles: true
//     }));
// });
