import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";
import movieScreenJson from "../../data/embeded3dModels/movieScreen.json";
import commandController from "../../controllers/commandController";
import { Mesh, PlaneGeometry } from "three";
import eventController from "../../controllers/eventController";

var distance = 5;
var intensity = .5;
var color = "#FFFFFF";

var AnimationModel3d = SceneDetailsBaseModel3d.extend({
  defaults: _.extend({},SceneDetailsBaseModel3d.prototype.defaults,
    {
    name: "AnimationModel3dSceneDetails",
    initialCameraPosition: { x:0, y: 0, z: -3},
    initialCameraTarget: { x:0, y: 1.5, z: -10},
    pointLights: [
      {x: -6, y: 6, z: -1,  color: color, intensity: intensity, distance: distance },
      {x: -6, y: 6, z: -7,  color: color, intensity: intensity, distance: distance },
      {x: -6, y: 6, z: -12, color: color, intensity: intensity, distance: distance },
      {x: 6,  y: 6, z: -1,  color: color, intensity: intensity, distance: distance },
      {x: 6,  y: 6, z: -7,  color: color, intensity: intensity, distance: distance },
      {x: 6,  y: 6, z: -12, color: color, intensity: intensity, distance: distance },
    ],
    intialAmbientLights: {
      directional: { color: "#FFFFFF", intensity: 0},  // color intensity,
      hemisphere: { groundColor: "#404040", skyColor: "#FFFFFF", intensity: 0.1 }  // skyColor, groundColor,
    }
  }),
  initialize: function () {
    this.addListeners();
  },
  addListeners:function () {
    eventController.on(eventController.VIDEO_PLAY_PAUSE, this.toggleVideoPlayback, this );
  },
  removeListeners: function () {
    eventController.off(eventController.VIDEO_PLAY_PAUSE, this.toggleVideoPlayback, this );
  },
  addInteractiveObjects: function () {
    SceneDetailsBaseModel3d.prototype.addInteractiveObjects.apply(this, arguments);
    this.set("interactiveObjects", [this.getMovieScreen()]);
  },
  toggleVideoPlayback: function () {
    var videoEl = this.get("interactiveObjects")[0].material.map.image;

    if (videoEl.paused) {
      videoEl.play();
    } else {
      videoEl.pause();
    }

    return videoEl.paused;
  },
  getMovieScreen: function () {
    var size = { w: 16 *.6, h: 9 *.6};
    var mat = commandController.request(commandController.LOAD_VIDEO_TEXTURE, "videos/cyclesDemo.mp4");
    var mesh = new Mesh( new PlaneGeometry( size.w, size.h ), mat );
    mesh.position.set(0, 3.25, -15.5);
    this.setClickType(mesh);
    return mesh;
  },
  setClickType: function (mesh) {
    mesh.clickData = { action: "video" };
  }
});

module.exports = AnimationModel3d;
