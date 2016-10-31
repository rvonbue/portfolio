import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";

var AnimationModel3d = SceneDetailsBaseModel3d.extend({
  initialize: function () {
    SceneDetailsBaseModel3d.prototype.initialize.apply(this, arguments);
    this.set("name", "AnimationModel3dSceneDetails");
    this.set("initialCameraPosition", { x:0, y: -0.5, z: 8});
    this.set("initialCameraTarget", { x:0, y: 1, z: 0});
    this.set("pointLights", [
      {x: 6, y: 1, z: 2, color: "#FFFFFF", intensity: 3, distance: 2 },
      {x: 6, y: 1, z: 6.5, color: "#FFFFFF", intensity: 3, distance: 2 },
      {x: -6, y: 1, z: 2, color: "#FFFFFF", intensity: 3, distance: 2 },
      {x: -6, y: 1, z: 6.5, color: "#FFFFFF", intensity: 3, distance: 2 },
    ]);
    this.set("intialAmbientLights", {
      ambient: ["#FFFFFF", 0], // color intensity
      directional: ["#FFFFFF", 0],  // color intensity,
      hemisphere: ["#404040", "#9BE2FE", 0.09]  // skyColor, groundColor, intensity
    });
  }
});

module.exports = AnimationModel3d;
