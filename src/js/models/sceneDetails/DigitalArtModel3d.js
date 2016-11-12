import commandController from "../../controllers/commandController";
import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";
// import { Mesh } from "three";

import pageData from "../../data/pageData/digitalArt";
import canvas from "../../data/embeded3dModels/canvas.json";
import easel from "../../data/embeded3dModels/easel.json";

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
  selectInteractiveObject: function (selectBool) {
    var changeNum = selectBool ? 3 : -3;

    if ( pageData[ this.get("projectIndex") + changeNum ] ) {
      this.set("projectIndex", this.get("projectIndex") + changeNum);
      this.loadImagesEasel();
    }

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
  addArtEasels: function () {
    var interactiveObjects = [];
    var zMod = -0.75;

    _.each(this.get("pointLights"), function (light, i) {
      var canvasMesh = this.getArtEasel();
      canvasMesh.position.set( light.x, 0, light.z + zMod);
      canvasMesh.position.y = this.get("parentScenePosition").y;
      canvasMesh.imageNum = i;
      this.get("object3d").add(canvasMesh);
      interactiveObjects.push(canvasMesh);
    }, this);

    this.set("interactiveObjects", interactiveObjects);
  },
  loadImagesEasel: function (forward) {
    _.each(this.get("interactiveObjects"), (mesh, i) => {
      var projectData = pageData[ this.get("projectIndex") + i];
      if (projectData) {
        mesh.material.map = commandController.request(commandController.LOAD_IMAGE_TEXTURE, projectData.imgSrc);
        mesh.visible = true;
      } else {
        mesh.visible = false;
      }
    });
  },
  getArtEasel: function () {
    var canvasMesh = commandController.request(commandController.PARSE_JSON_MODEL, canvas);
    canvasMesh.name = "photoswipe";
    var easelMesh = commandController.request(commandController.PARSE_JSON_MODEL, easel);
    canvasMesh.add(easelMesh);
    return canvasMesh;
  }
});

module.exports = DigitalArtModel3d;
