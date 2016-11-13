import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";
import movieScreenJson from "../../data/embeded3dModels/movieScreen.json";
import commandController from "../../controllers/commandController";
import { Mesh, PlaneGeometry } from "three";
import eventController from "../../controllers/eventController";

var AnimationModel3d = SceneDetailsBaseModel3d.extend({
  defaults: _.extend({},SceneDetailsBaseModel3d.prototype.defaults,
    {
    name: "AnimationModel3dSceneDetails",
    initialCameraPosition: { x:0, y: 1.5, z: 4.5},
    initialCameraTarget: { x:0, y: 3.5, z: 0},
    pointLights: [
      {x: 6, y: 1, z: 2, color: "#FFFFFF", intensity: 1, distance: 2 },
      {x: -6, y: 1, z: 2, color: "#FFFFFF", intensity: 1, distance: 2 },
    ],
    intialAmbientLights: {
      directional: ["#FFFFFF", 0],  // color intensity,
      hemisphere: ["#404040", "#FFFFFF", 0.06]  // skyColor, groundColor, intensity
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
    var size = { w: 16 *.75, h: 9 *.75};
    var geometry = new PlaneGeometry( size.w, size.h );
    var videoTexture = commandController.request(commandController.LOAD_VIDEO_TEXTURE, "videos/california.mp4");
    var mesh = new Mesh( geometry, videoTexture );
    mesh.position.set(0, 5, -3);
    mesh.clickType = "video";
    return mesh;
  }
});

module.exports = AnimationModel3d;
