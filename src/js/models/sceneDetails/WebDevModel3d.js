import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";
import eventController from "../../controllers/eventController";

var WebDevModel3d = SceneDetailsBaseModel3d.extend({
  defaults: _.extend({},SceneDetailsBaseModel3d.prototype.defaults,
    {
    name: "WebDevSD",
    initialCameraPosition: { x:2.25, y: 0.25, z: 4},
    initialCameraTarget: { x:3, y: 1.75, z: 2},
    pointLights: [
      {x: 6, y: 2, z: 2, color: "#0000FF", intensity: 1.5, distance: 2.5 }, //video game lights
      {x: 5.65, y: 2, z: 2, color: "#fe3a08", intensity: 1.5, distance: 2.5 }, //video game  lights
      {x: 1.5, y: 1.5, z: 1.5, color: "#0000FF", intensity: 3, distance: 1.5 },  //computer screen fake light
      // {x: 0.5, y: 1.5, z: 1.5, color: "#FFFFFF", intensity: 1, distance: 5 }
    ],
    intialAmbientLights: {
      directional: { color: "#FFFFFF", intensity: 0.0 },  // color intensity,
      hemisphere: { groundColor: "#404040", skyColor: "#FFFFFF", intensity: 0.15 }  // skyColor, groundColor, intensity
    },
    modelUrls: ["sceneDetails", "videoGameCabinet", "computerMonitor"],
  }),
  initialize: function () {
    SceneDetailsBaseModel3d.prototype.initialize.apply(this, arguments);
  }
});

module.exports = WebDevModel3d;
