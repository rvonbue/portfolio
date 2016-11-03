import commandController from "../../controllers/commandController";
import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";
import canvas from "../../data/embeded3dModels/canvas.json";
import easel from "../../data/embeded3dModels/easel.json";
import { TextureLoader, Mesh } from "three";
import pageData from "../../data/pageData/digitalArt";

var DigitalArtModel3d = SceneDetailsBaseModel3d.extend({
  defaults: {
    name: "DigitalArtSD",
    initialCameraPosition: { x:0, y: -0.75, z: 4.25 },
    initialCameraTarget: { x:0, y: 1, z: 0 },
    pointLights: [
      { x: -2, y: 2.5, z: 2.5, color: "#FFFFFF", intensity: 4, distance: 5 },
      { x: 0, y: 2.5, z: 2.5, color: "#FFFFFF", intensity: 4, distance: 5 },
      { x: 2, y: 2.5, z: 2.5, color: "#FFFFFF", intensity: 4, distance: 5 }
    ],
    intialAmbientLights: {
      hemisphere: ["#FFFFFF", "#FFFFFF", 0.75],  // skyColor, groundColor, intensity
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
  selectNext: function (selectBool) {
    var changeNum = selectBool ? 3 : -3;
    this.set("projectIndex", this.get("projectIndex") + changeNum);
    if (pageData[this.get("projectIndex")])  this.loadImagesEasel();
  },
  getPSImages: function (numClicked) {
    var photoSwipeImgArray = [];
    for (var i = 0; i < this.get("interactiveObjects").length; i++ ) {
      if (pageData.length > this.get("projectIndex") + i) {
        var imgSrc = pageData[this.get("projectIndex") + i].imgSrc;
        photoSwipeImgArray.push({ src: imgSrc, w: 1920, h: 1080 });
      }
    }
    return photoSwipeImgArray;
  },
  addInteractiveObjects: function (modelLoader) {
    this.addArtEasels(modelLoader);
    this.loadImagesEasel(true);
  },
  loadImagesEasel: function (forward) {
    // var imgNum = 0;
    _.each(this.get("interactiveObjects"), (mesh, i) => {
      var projectData = pageData[ this.get("projectIndex") + i];
      if (projectData) {
        var newTexture = commandController.request(commandController.LOAD_IMAGE_TEXTURE, projectData.imgSrc);
        mesh.material.map = newTexture;
        mesh.visible = true;
        // imgNum++;
      } else {
        mesh.visible = false;
      }
    });
    // this.set("projectIndex", projectIndex += forward ? imgNum : -imgNum); //add or subtract 3 from the how many images
  },
  addArtEasels: function (modelLoader) {
    var interactiveObjects = [];
    var zMod = -0.75;
    _.each(this.get("pointLights"), function (light, i) {
      var canvasMesh = this.getArtEasel(modelLoader);
      canvasMesh.position.set( light.x, 0, light.z + zMod);
      canvasMesh.position.y = this.get("parentScenePosition").y;
      canvasMesh.name = "photoswipe";
      canvasMesh.imageNum = i;
      this.get("object3d").add(canvasMesh);
      interactiveObjects.push(canvasMesh);
    }, this);
    this.set("interactiveObjects", interactiveObjects);
  },
  getArtEasel: function (modelLoader) {
    var model = modelLoader.parseJSON(canvas);
    var canvasMesh = new Mesh( model.geometry, model.materials[0]); //only one material on the door
    var model2 = modelLoader.parseJSON(easel);
    var easelMesh = new Mesh( model2.geometry, model2.materials[0]);
    canvasMesh.add(easelMesh);
    return canvasMesh;
  }
});

module.exports = DigitalArtModel3d;
