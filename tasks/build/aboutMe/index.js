var gulp = require("gulp");

gulp.task("build:aboutMe", [
  "build:AboutMeImages",
  "build:AboutMeData",
]);

require("./aboutMeData");
require("./aboutMeImages");
