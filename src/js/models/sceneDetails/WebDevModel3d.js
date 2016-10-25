import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";

var WebDevModel3d = SceneDetailsBaseModel3d.extend({
  name: "Your Name Here",
  initialize: function () {
    SceneDetailsBaseModel3d.prototype.initialize.apply(this, arguments);
    console.log("Hello WebDevModel3d:", this);
    //
    this.set("initialCameraPosition", { x:0, y: 0, z: 0});
    this.set("initialCameraTarget", { x:0, y: 0, z: 0});
    this.set("pointLights", [
      {x: 0, y: 0.5, z: 0, color: "#FFFFFF", instensity: 1, distance: 5 },
      {x: 2, y: 0.5, z: 3, color: "#00FFFF", instensity: 5, distance: 5 }
    ]);
  }
});

module.exports = WebDevModel3d;
