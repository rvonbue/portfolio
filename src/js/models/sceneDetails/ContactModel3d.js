import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";
import eventController from "../../controllers/eventController";

var ContactModel3d = SceneDetailsBaseModel3d.extend({
  defaults: _.extend({},SceneDetailsBaseModel3d.prototype.defaults,
    {
    name: "ContactModel3dSceneDetails",
    initialCameraPosition: { x:0, y: 0, z: 6.5},
    initialCameraTarget: { x:0, y: 2, z: 0},
    pointLights: [
      // {x: 0, y: 5, z: 5, color: "#FFFFFF", intensity: 5, distance: 10 },
      // {x: 3, y: 5, z: 5, color: "#FF0000", intensity: 5, distance: 10 },
      // {x: 6, y: 5, z: -8, color: "#FFFFFF", intensity: 5, distance: 5 },
    ],
    directionalLight: { color: "#FFFFFF", x:0, y:0, z:0 },
    intialAmbientLights: {
      directional: { color: "#FFFFFF", intensity: 0.1 },  // color intensity,
      hemisphere: { groundColor: "#404040", skyColor: "#FFFFFF", intensity:1 }  // skyColor, groundColor, intensity
    },
    modelUrls: [ "sceneDetails" ]
  }),
  initialize: function () {
    SceneDetailsBaseModel3d.prototype.initialize.apply(this, arguments);
  }
});

module.exports = ContactModel3d;
