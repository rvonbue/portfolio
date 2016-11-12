import commandController from "../../controllers/commandController";
import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";
// import { Mesh } from "three";

import pageData from "../../data/pageData/digitalArt";
import canvas from "../../data/embeded3dModels/canvas.json";
import easel from "../../data/embeded3dModels/easel.json";

var DigitalArtModel3d = SceneDetailsBaseModel3d.extend({
  defaults: _.extend({},SceneDetailsBaseModel3d.prototype.defaults,
    {
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
  }),
  initialize: function (options) {
    SceneDetailsBaseModel3d.prototype.initialize.apply(this, arguments);
    this.set("modelUrls", [...this.get("modelUrls"), "artEasel" ]);
    // console.log("this", this);
    // this.on("change:object3d", function () {
    //   this.addArtEasels();
    //   this.loadImagesEasel(true);
    // })
  },
  showHide: function (tBool, selectedParentScene) {
    SceneDetailsBaseModel3d.prototype.showHide.apply(this, arguments);
  },
  selectNextObject: function () {
    this.selectInteractiveObject(3);
  },
  selectPrevObject: function () {
    this.selectInteractiveObject(-3);
  },
  selectInteractiveObject: function (changeNum) {
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
  // addInteractiveObjects: function (modelLoader) {
    // SceneDetailsBaseModel3d.prototype.addInteractiveObjects.apply(this, arguments);
  // },
  loadSceneDetailModels: function (modelObj) {
    this.set("totalLoaded", this.get("totalLoaded") + 1);

    if (modelObj.name === "sceneDetails") {
      this.set("object3d", modelObj.object3d);
    } else {
      // this.get("interactiveObjects").push(modelObj.object3d)
      this.addArtEasels(modelObj.object3d);
      this.loadImagesEasel(true);
    }

    this.allModelsLoaded();
  },
  addArtEasels: function (obj3d) {
    var interactiveObjects = [];
    // var zMod = -0.75;

    _.each(this.get("pointLights"), function (light, i) {
      var canvasMesh = obj3d.GdeepCloneMaterials();
      canvasMesh.position.set( light.x, 0, light.z );
      canvasMesh.imageNum = i;
      canvasMesh.clickType = "photoswipe";
      interactiveObjects.push(canvasMesh);
    }, this);

    this.set("interactiveObjects", interactiveObjects);
  },
  loadImagesEasel: function (forward) {
    _.each(this.get("interactiveObjects"), (mesh, i) => {
      var projectData = pageData[ this.get("projectIndex") + i];
      if (projectData) {
        mesh.material.materials[1].map = commandController.request(commandController.LOAD_IMAGE_TEXTURE, projectData.imgSrc);
        mesh.visible = true;
      } else {
        mesh.visible = false;
      }
    });
  }
});

module.exports = DigitalArtModel3d;
