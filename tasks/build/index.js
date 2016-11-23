var gulp = require("gulp");

gulp.task("build", [
  "build:aboutMe",
  "build:digitalArt"
]);

require("./aboutMe");
require("./digitalArt");
