import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";

var WebDevModel3d = SceneDetailsBaseModel3d.extend({
  name: "Your Name Here",
  initialize: function () {
    Base3dView.prototype.initialize.apply(this, arguments);
  },
  setupSceneLights: function () {

  }
});

module.exports = WebDevModel3d;
