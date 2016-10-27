import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";

var WebDevModel3d = SceneDetailsBaseModel3d.extend({
  initialize: function () {
    this.set("name", "WebDevModel3dSceneDetails");
    SceneDetailsBaseModel3d.prototype.initialize.apply(this, arguments);
    this.set("initialCameraPosition", { x:0, y: 0, z: 5});
    this.set("initialCameraTarget", { x:3, y: 2, z: 2});
    this.set("pointLights", [
      {x: 4, y: 1.5, z: 2, color: "#FFFFFF", intensity: 8, distance: 3 }, //couch lights
      {x: 4, y: 1.5, z: 6.5, color: "#FFFFFF", intensity: 8, distance: 3 }, //couch lights
      {x: 0.5, y: 1, z: 2, color: "#FF0000", intensity: 2, distance: 2 }  //desk lamp
    ]);
  }
});

module.exports = WebDevModel3d;
