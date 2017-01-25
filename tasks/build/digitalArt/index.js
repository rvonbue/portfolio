var gulp = require("gulp");
var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize')
var parallel = require("concurrent-transform");
var os = require("os");

gulp.task('build:digitalArt', function() {
  gulp.src('./src/images/digitalArt/**/*.{png,mov,mpg}')
  .pipe(imagemin({ progressive: true }))
  // .pipe(gulp.dest('./bin/images/digitalArt'))
  .pipe(gulp.dest('./bin/images/digitalArt/'))
  .pipe(parallel(
     imageResize({
       width: 550,
      //  height: "100%",
       background: "#FFFFFF"
     }),
     os.cpus().length
   ))
  .pipe(gulp.dest('./bin/images/digitalArt/thumbs/'));
});
