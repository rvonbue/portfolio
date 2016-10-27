import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";

var AnimationModel3d = SceneDetailsBaseModel3d.extend({
  name: "Your Name Here",
  initialize: function () {
    SceneDetailsBaseModel3d.prototype.initialize.apply(this, arguments);
    this.set("name", "AnimationModel3dSceneDetails");
    this.set("initialCameraPosition", { x:0, y: -0.5, z: 8});
    this.set("initialCameraTarget", { x:0, y: 1, z: 0});
    this.set("pointLights", [
      {x: 5, y: 3, z: 2, color: "#FFFFFF", intensity: 5, distance: 4 },
      {x: 5, y: 3, z: 6.5, color: "#FFFFFF", intensity: 8, distance: 4 },
      {x: -5, y: 3, z: 2, color: "#FFFFFF", intensity: 5, distance: 5 },
      {x: -5, y: 3, z: 6.5, color: "#FFFFFF", intensity: 8, distance: 5 },
    ]);
  }
});

module.exports = AnimationModel3d;
