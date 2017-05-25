import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";
import commandController from "../../controllers/commandController";
import { Mesh, BoxGeometry, PlaneGeometry, MeshLambertMaterial } from "three";
import eventController from "../../controllers/eventController";

var distance = 5;
var intensity = .5;
var color = "#FFFFFF";

var AnimationModel3d = SceneDetailsBaseModel3d.extend({
  defaults: _.extend({},SceneDetailsBaseModel3d.prototype.defaults,
    {
    name: "AnimationModel3dSceneDetails",
    initialCameraPosition: { x:0, y: 0, z:  1 },
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
    this.set("interactiveObjects",
    [
      this.getMovieScreen(),
      this.getYouTubeButton()
    ]);
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
    var mesh = new Mesh( new PlaneGeometry( size.w, size.h), mat );
    mesh.position.set(0, 3.25, -7);
    this.setClickType(mesh, "video");

    return mesh;
  },
  getYouTubeButton: function () {
    var size = { w: 2 , h: 1, d: 0.125 };
    var mat = commandController.request(commandController.LOAD_MATERIAL, "images/3DAnimation/youtube.png", { meshType: "basic" });
    var mesh = new Mesh( new BoxGeometry( size.w, size.h, size.d ), mat);
        mesh.clickData= { url: "https://www.youtube.com/watch?list=PLuVBBqTFs-RebOygGDHcqiMUpmfbR_I0M&v=tNs3_4HyIcM" };
        mesh.position.set(6.5, 0.75, -7);

    this.setClickType(mesh, "link:ext");
    return mesh;
  },
  setClickType: function (mesh, action) {
    mesh.clickData = { action: action };
  }
});

module.exports = AnimationModel3d;
