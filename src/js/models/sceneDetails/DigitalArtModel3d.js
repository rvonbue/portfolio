import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";
import canvas from "../../data/embeded3dModels/canvas.json";
import easel from "../../data/embeded3dModels/easel.json";
import THREE from "three";

var DigitalArtModel3d = SceneDetailsBaseModel3d.extend({
  initialize: function (options) {
    SceneDetailsBaseModel3d.prototype.initialize.apply(this, arguments);
    window.wtf = this;
    this.set("name", "DigitalArtSD");
    this.set("initialCameraPosition", { x:0, y: -0.25, z: 2.75});
    this.set("initialCameraTarget", { x:0, y: 1.5, z: 0});
    this.set("pointLights", [
      { x: 0, y: 1, z: 1, color: "#FFFFFF", intensity: 7, distance: 2 },
      { x: 2, y: 1, z: 1, color: "#0000FF", intensity: 7, distance: 2 },
      { x: -2, y: 1, z: 1, color: "#FFFFFF", intensity: 7, distance: 2 }
    ]);
    this.set("intialAmbientLights", {
      ambient: ["#FFFFFF", 0], // color intensity
      hemisphere: ["#9BE2FE", "#404040", 0.4],  // skyColor, groundColor, intensity
      directional: ["#FFFFFF", 0]  // color intensity,
    });
  },
  addInteractiveObjects: function (modelLoader) {
    this.addArtEasels(modelLoader);
  },
  showHide: function (tBool, selectedParentScene) {
    SceneDetailsBaseModel3d.prototype.showHide.apply(this, arguments);
  },
  addArtEasels: function (modelLoader) {
    var interactiveObjects = [];
    _.each(this.get("pointLights"), function (light) {
      var canvasMesh = this.getArtEasel(modelLoader);
      canvasMesh.position.set( light.x, light.y, light.z);
      canvasMesh.position.y = this.get("parentScenePosition").y;
      // this.get("object3d").add(canvasMesh);
      interactiveObjects.push(canvasMesh);
    }, this);
    this.set("interactiveObjects", interactiveObjects);
  },
  getArtEasel: function (modelLoader) {
    var model = modelLoader.parseJSON(canvas);
    var canvasMesh = new THREE.Mesh( model.geometry, model.materials[0]); //only one material on the door
    var model2 = modelLoader.parseJSON(easel);
    var easelMesh = new THREE.Mesh( model2.geometry, model2.materials[0]);
    canvasMesh.add(easelMesh);
    return canvasMesh;
  }
});

module.exports = DigitalArtModel3d;
