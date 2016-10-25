import BaseModel3d from "../BaseModel3d";

var SceneDetailsBaseModel3d = BaseModel3d.extend({
  initialize: function( options ) {
    BaseModel3d.prototype.initialize.apply(this, arguments);
    this.setInitialPosition(options.sceneModel);
    console.log("SceneDetailsModel:");
  },
  setInitialPosition: function (sceneModel) {
    var y = sceneModel.get("object3d").position.y;
    this.get("object3d").position.y = y;
    sceneModel.get("object3d").add(this.get("object3d"));
  }
});

module.exports = SceneDetailsBaseModel3d;
