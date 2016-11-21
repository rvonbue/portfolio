var gulp = require('gulp');
var map = require('map-stream');
var vfs = require('vinyl-fs');
var jsonTransform = require('gulp-json-transform')

var log = function(file, cb) {
  console.log(file.contents);
  cb(null, file);
};


gulp.task('build', function() {
  gulp.src('./bin/models3d/floor2/**/*.json')
  .pipe(jsonTransform(function(data, file) {
    return {
      name: data.name, path: file.relative
    };
  }))
  .pipe(concat("exampleList.js"))
  .pipe(insert.wrap("module.exports = [", "];"))
  .pipe(gulp.dest("client/src/js/data"))
  .pipe(gulp.dest('./bin/out/'));
});

//
// var gulp = require("gulp");
// var map = require("map-stream");
// var concat = require("gulp-concat");
// var insert = require("gulp-insert");
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
