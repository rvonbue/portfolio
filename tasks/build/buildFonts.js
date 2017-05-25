var gulp = require('gulp');

gulp.task('build:fonts', function() {
  return gulp.src('node_modules/font-awesome/fonts/*')
    .pipe(gulp.dest('bin/fonts'))
})
