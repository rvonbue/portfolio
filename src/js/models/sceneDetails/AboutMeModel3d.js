import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";
import eventController from "../../controllers/eventController";

var AboutMe3d = SceneDetailsBaseModel3d.extend({
  defaults: _.extend({},SceneDetailsBaseModel3d.prototype.defaults,
    {
    name: "AboutMe",
    initialCameraPosition: { x:3, y: 0.25, z: 4},
    initialCameraTarget: { x:-2, y: 2.25, z: -2},
    pointLights: [
      {x: -2, y: 1.5, z: 1.5, color: "#FFFFFF", intensity: 1, distance: 5 },
      {x: -2, y: 1.5, z: -1.5, color: "#FFFFFF", intensity: 1, distance: 5 },
      {x: 0, y: 1.5, z: -1.5, color: "#FFFFFF", intensity: 1, distance: 5 }
    ],
    intialAmbientLights: {
      directional: { color: "#FFFFFF", intensity: 0.2 },  // color intensity,
      hemisphere: { groundColor: "#404040", skyColor: "#FFFFFF", intensity: 0.50 }  // skyColor, groundColor, intensity
    },
    // modelUrls: ["sceneDetails"],
  }),
  initialize: function () {
    SceneDetailsBaseModel3d.prototype.initialize.apply(this, arguments);
  }
});

module.exports = AboutMe3d;
