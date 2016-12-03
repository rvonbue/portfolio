var gulp = require("gulp");

gulp.task("build", [
  "build:aboutMe",
  "build:digitalArt",
  "build:textures"
]);

require("./aboutMe");
require("./digitalArt");
require("./textures");
