import Base3dView from "./Base3dView";

var HomeView3d = Base3dView.extend({
  name: "home",
  initialize: function () {
    Base3dView.prototype.initialize.apply(this, arguments);
    console.log("init HomeView3d");
  },
  getBaseScene: function () {

  },
  loadInteractiveObjects: function () {

  }
});

module.exports = HomeView3d;
