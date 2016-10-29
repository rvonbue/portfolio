import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";

var WebDevModel3d = SceneDetailsBaseModel3d.extend({
  initialize: function () {
    this.set("name", "WebDevModel3dSceneDetails");
    SceneDetailsBaseModel3d.prototype.initialize.apply(this, arguments);
    this.set("initialCameraPosition", { x:1, y: 0, z: 4});
    this.set("initialCameraTarget", { x:1.75, y: 2, z: 2});
    this.set("pointLights", [
      {x: 5.90, y: 2, z: 1.5, color: "#0000FF", intensity: 1, distance: 2 }, //video game lights
      {x: 5.65, y: 2, z: 1.65, color: "#fe3a08", intensity: 1, distance: 2 }, //video game  lights
      {x: 0.5, y: 1.5, z: 1, color: "#0000FF", intensity: 3, distance: 2.5 }  //computer screen fake light
    ]);
    this.set("intialAmbientLights", {
      ambient: ["#FFFFFF", 0], // color intensity
      directional: ["#FFFFFF", 0],  // color intensity,
      hemisphere: ["#404040", "#9BE2FE", 0.05]  // skyColor, groundColor, intensity
    });
  }
});

module.exports = WebDevModel3d;
