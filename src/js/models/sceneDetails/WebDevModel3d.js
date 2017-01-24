import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";
import eventController from "../../controllers/eventController";

var WebDevModel3d = SceneDetailsBaseModel3d.extend({
  defaults: _.extend({},SceneDetailsBaseModel3d.prototype.defaults,
  {
    name: "WebDevSD",
    initialCameraPosition: { x:1.25, y: -1, z: 5},
    initialCameraTarget: { x:3, y: 1.5, z: 2},
    pointLights: [
      {x: 6, y: 2, z: 2, color: "#0000FF", intensity: 1.5, distance: 2.5 }, //video game lights
      {x: 5.65, y: 2, z: 2, color: "#fe3a08", intensity: 1.5, distance: 2.5 }, //video game  lights
      {x: 1.5, y: 1.5, z: 1.5, color: "#0000FF", intensity: 3, distance: 1.5 },  //computer screen fake light
    ],
    intialAmbientLights: {
      directional: { color: "#FFFFFF", intensity: 0 },  // color intensity,
      hemisphere: { groundColor: "#404040", skyColor: "#FFFFFF", intensity: 0.25 }  // skyColor, groundColor, intensity
    },
    modelUrls: ["sceneDetails", "videoGameCabinet", "computerMonitor"],
  }),
  initialize: function () {
    SceneDetailsBaseModel3d.prototype.initialize.apply(this, arguments);
  },
  setClickData: function (obj3d) {
    switch(obj3d.name) {
      case "videoGameCabinet":
        obj3d.clickData = { action: "link", url: "dolphinsVSharks.html"};
        break;
      case "computerMonitor":
        obj3d.clickData = { action: "link", url: "computerMonitor.html"};
        break;
      default:
        obj3d.clickData = { action: "default", url: "webDv" };
        break;
    }
  }
});

module.exports = WebDevModel3d;
