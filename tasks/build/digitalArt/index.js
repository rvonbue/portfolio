var gulp = require("gulp");
var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize')

gulp.task('build:digitalArt', function() {
  gulp.src('./src/images/digital/**/*.{png,mov,mpg}')
  .pipe(imagemin({ progressive: true }))
  .pipe(gulp.dest('./bin/images/digitalArt'))
  .pipe(imageResize({
      width : 200,
    }))
  .pipe(gulp.dest('./bin/images/digitalArt/thumbs/'));
});
