import Base3dView from "./Base3dView";

var MovieTheaterView3d = Base3dView.extend({
  name: "movieTheater",
  initialize: function () {
    Base3dView.prototype.initialize.apply(this, arguments);
      console.log("init MovieTheaterView3d");
  },
  getBaseScene: function () {

  },
  loadInteractiveObjects: function () {

  }
});

module.exports = MovieTheaterView3d;
