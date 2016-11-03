import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";
import movieScreenJson from "../../data/embeded3dModels/movieScreen.json";
import { MeshBasicMaterial, Mesh, VideoTexture, LinearFilter, Texture, FRONTSIDE } from "three";
import commandController from "../../controllers/commandController";

var AnimationModel3d = SceneDetailsBaseModel3d.extend({
  initialize: function () {
    SceneDetailsBaseModel3d.prototype.initialize.apply(this, arguments);
    this.set("name", "AnimationModel3dSceneDetails");
    this.set("initialCameraPosition", { x:0, y: -0.5, z: 8});
    this.set("initialCameraTarget", { x:0, y: 1, z: 0});
    this.set("pointLights", [
      {x: 6, y: 1, z: 2, color: "#FFFFFF", intensity: 1, distance: 2 },
      // {x: 6, y: 1, z: 6.5, color: "#FFFFFF", intensity: 2, distance: 2 },
      {x: -6, y: 1, z: 2, color: "#FFFFFF", intensity: 1, distance: 2 },
      // {x: -6, y: 1, z: 6.5, color: "#FFFFFF", intensity: 2, distance: 2 },
    ]);
    this.set("intialAmbientLights", {
      directional: ["#FFFFFF", 0],  // color intensity,
      hemisphere: ["#404040", "#FFFFFF", 0.09]  // skyColor, groundColor, intensity
    });
  },
  addInteractiveObjects: function (modelLoader) {
    this.set("interactiveObjects", [this.getMovieScreen(modelLoader)]);
    _.each(this.get("interactiveObjects"), function (mesh) {
      this.get("object3d").add(mesh);
    }, this);
  },
  getMovieScreen: function (modelLoader) {
    var model = modelLoader.parseJSON(movieScreenJson);
    var videoTexture = commandController.request(commandController.LOAD_VIDEO_TEXTURE, "videos/california.mp4");
    var mesh = new Mesh( model.geometry, videoTexture); //only one material on the door;
    mesh.position.y += this.get("parentScenePosition").y;

    return mesh;
  }
});

module.exports = AnimationModel3d;
