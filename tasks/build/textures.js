var gulp = require("gulp");
var imagemin = require('gulp-imagemin');
var imageResize = require('gulp-image-resize')
var parallel = require("concurrent-transform");
var os = require("os");
var sizeOf = require('image-size');
var buffer = require('gulp-buffer');
var tap = require('gulp-tap');

var imageDimensions = { width: 25   , height: 25 };

gulp.task('build:textures', function() {
  gulp.src('./src/textures/**/*.{png,mpg}')
  .pipe(imagemin({ progressive: true }))
  .pipe(buffer())
  .pipe(tap(function(file, t) {
    var dimensions = sizeOf(file.contents);

    if ( !dimensions.width )
    imageDimensions = {
      width: nearestPowerOfTwo(dimensions.width),
      height: nearestPowerOfTwo(dimensions.height)
    };
  }))
  .pipe(imageResize({
       width: imageDimensions.width,
       height:  imageDimensions.height,
       background: "#FFFFFF",
       upscale: true,
       crop: true
     }))
  .pipe(gulp.dest('./bin/textures'));
});

//from THREE.math
function nearestPowerOfTwo ( value ) {
   return Math.pow( 2, Math.round( Math.log( value ) / Math.LN2 ) );
};
// var dimensions = sizeOf(file.contents);
