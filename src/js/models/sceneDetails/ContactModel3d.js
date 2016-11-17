import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";
import eventController from "../../controllers/eventController";

var ContactModel3d = SceneDetailsBaseModel3d.extend({
  defaults: _.extend({},SceneDetailsBaseModel3d.prototype.defaults,
    {
    name: "ContactModel3dSceneDetails",
    initialCameraPosition: { x:-3, y: 0, z: 6.5},
    initialCameraTarget: { x:-3, y: 2, z: 0},
    pointLights: [
      {x: 0, y: 5, z: -6, color: "#FFFFFF", intensity: 5, distance: 5 },
      {x: 3, y: 5, z: -8, color: "#FFFFFF", intensity: 5, distance: 5 },
      // {x: 6, y: 5, z: -8, color: "#FFFFFF", intensity: 5, distance: 5 },
    ],
    directionalLight: { color: "#FFFFFF", x:0, y:0, z:0 },
    intialAmbientLights: {
      directional: ["#FFFFFF", 0.1],  // color intensity,
      hemisphere: ["#404040", "#FFFFFF", 1]  // skyColor, groundColor, intensity
    }
  }),
  initialize: function () {
    SceneDetailsBaseModel3d.prototype.initialize.apply(this, arguments);
  }
});

module.exports = ContactModel3d;
