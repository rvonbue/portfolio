import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";
import canvas from "../../data/embeded3dModels/canvas.json";
import easel from "../../data/embeded3dModels/easel.json";
import THREE from "three";
import pageData from "../../data/pageData/digitalArt";

var DigitalArtModel3d = SceneDetailsBaseModel3d.extend({
  defaults: {
    name: "DigitalArtSD",
    initialCameraPosition: { x:0, y: -0.75, z: 2.75 },
    initialCameraTarget: { x:0, y: 1, z: 0 },
    pointLights: [
      { x: -2, y: 1, z: 1, color: "#FFFFFF", intensity: 7, distance: 2 },
      { x: 0, y: 1, z: 1, color: "#FFFFFF", intensity: 7, distance: 2 },
      { x: 2, y: 1, z: 1, color: "#0000FF", intensity: 7, distance: 2 }
    ],
    intialAmbientLights: {
      ambient: ["#FFFFFF", 0], // color intensity
      hemisphere: ["#9BE2FE", "#404040", 0.4],  // skyColor, groundColor, intensity
      directional: ["#FFFFFF", 0]  // color intensity,
    },
    projectIndex: 0
  },
  initialize: function (options) {
    SceneDetailsBaseModel3d.prototype.initialize.apply(this, arguments);
    // console.log("this", this);
  },
  showHide: function (tBool, selectedParentScene) {
    SceneDetailsBaseModel3d.prototype.showHide.apply(this, arguments);
  },
  loadImagesEasel: function (forward) {
    var projectIndex = this.get("projectIndex");
    var imgNum = 0;
    _.each(this.get("interactiveObjects"), (mesh, i) => {
      var projectData = pageData[projectIndex + i];
      if (projectData) {
        mesh.material.map = new THREE.TextureLoader().load( projectData.imgSrc);
        imgNum++;
      }
    });
    this.set("projectIndex", projectIndex += forward ? imgNum : -imgNum); //add or subtract 3 from the how many images
  },
  addInteractiveObjects: function (modelLoader) {
    this.addArtEasels(modelLoader);
    this.loadImagesEasel(true);
  },
  addArtEasels: function (modelLoader) {
    var interactiveObjects = [];
    _.each(this.get("pointLights"), function (light) {
      var canvasMesh = this.getArtEasel(modelLoader);
      canvasMesh.position.set( light.x, light.y, light.z);
      canvasMesh.position.y = this.get("parentScenePosition").y;
      this.get("object3d").add(canvasMesh);
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
