import commandController from "../../controllers/commandController";
import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";
import pageData from "../../data/pageData/digitalArt";

var DigitalArtModel3d = SceneDetailsBaseModel3d.extend({
  defaults: _.extend({},SceneDetailsBaseModel3d.prototype.defaults,
    {
    name: "DigitalArtSD",
    initialCameraPosition: { x:0, y: -1.25, z: 3.50 },
    initialCameraTarget: { x:0, y: 1, z: 0 },
    pointLights: [
      { x: -3, y: 2, z: 1.5, color: "#FFFFFF", intensity: 3, distance: 5 },
      { x: 0, y: 2, z: 1.5, color: "#FFFFFF", intensity: 3, distance: 5 },
      { x: 3, y: 2, z: 1.5, color: "#FFFFFF", intensity: 3, distance: 5 }
    ],
    intialAmbientLights: {
      directional: { color: "#FFFFFF", intensity: 0.0 },  // color intensity,
      hemisphere: { groundColor: "#FFFFFF", skyColor: "#FFFFFF", intensity: 0.15 }  // skyColor, groundColor, intensity
    },
    projectIndex: 0,
    modelUrls: ["sceneDetails", "artEasel"]
  }),
  initialize: function (options) {
    SceneDetailsBaseModel3d.prototype.initialize.apply(this, arguments);
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
  loadSceneDetailModels: function (modelObj) {
    this.set("totalLoaded", this.get("totalLoaded") + 1);

    if (modelObj.name === "sceneDetails") {
      this.set("object3d", modelObj.object3d);
    } else if (modelObj.name === "artEasel") {
      this.addArtEasels(modelObj.object3d);
      this.loadImagesEasel(true);
    }

    this.allModelsLoaded();
  },
  addArtEasels: function (obj3d) {
    var interactiveObjects = [];

    _.each(this.get("pointLights"), function (light, i) {
      var canvasMesh = obj3d.GdeepCloneMaterials();
      canvasMesh.position.set( light.x, 0, 0 );
      this.setClickData(canvasMesh, i);
      canvasMesh.geometry.computeBoundingBox();
      interactiveObjects.push(canvasMesh);
    }, this);

    this.set("interactiveObjects", interactiveObjects);
  },
  setClickData: function (canvasMesh, i) {
    canvasMesh.clickData = { action: "photoswipe", imageNum: i };
  },
  loadImagesEasel: function (forward) {
    _.each(this.get("interactiveObjects"), (mesh, i) => {
      var projectData = pageData[ this.get("projectIndex") + i ];
      if (projectData) {
        mesh.material.materials[1].map = commandController.request(
          commandController.LOAD_IMAGE_TEXTURE,
          projectData.thumbSrc
        );
        mesh.visible = true;
      } else {
        mesh.visible = false;
      }
    });
  }
});

module.exports = DigitalArtModel3d;
