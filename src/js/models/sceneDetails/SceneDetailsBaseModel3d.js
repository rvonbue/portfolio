import BaseModel3d from "../BaseModel3d";
import eventController from "../../controllers/eventController";

var SceneDetailsBaseModel3d = Backbone.Model.extend({
  defaults: {
    name: "Spinach",
    selected: false,
    // ready: false,
    object3d: null,
    pointLights: new Array,
    parentScenePosition: { x:0, y: 0, z: 0},
    initialCameraPosition: { x:0, y: 0, z: 0},
    initialCameraTarget: { x:0, y: 0, z: 0},
    interactiveObjects: [],
    intialAmbientLights:{
      directional: { color: "#FFFFFF", intensity: 0},  // color intensity,
      hemisphere: { groundColor: "#404040", skyColor: "#FFFFFF", intensity: 0.06 }
    },
    modelUrls: ["sceneDetails"],
    totalLoaded: 0,
    projectIndex: null
  },
  setInitialPosition: function (sceneModel) {
    var y = this.get("parentScenePosition").y;
    this.get("object3d").position.y = y;
  },
  showHide: function (tBool, selectedParentScene) {
    var showHideBool = tBool && selectedParentScene;

    this.set("selected", showHideBool);
    _.each(this.getAllMeshes(), function (mesh) {
      if ( mesh ) mesh.visible = showHideBool;
    });

  },
  getAllMeshes: function () {
    return [...this.get("sceneLights"), ...this.get("interactiveObjects"), this.get("object3d") ];
  },
  addInteractiveObjects: function () {
    eventController.on(eventController.SCENE_DETAILS_LOADED, this.loadSceneDetailModels, this);

    var path = "models3d/floor" + this.get("floorIndex") + "/";
    _.each( this.get("modelUrls"), function (name) {
      var loaderObj = { name: name, sceneModelName: 4 }
      var url = path + name + ".json";
      eventController.trigger(eventController.LOAD_JSON_MODEL, url, loaderObj );
    });

  },
  loadSceneDetailModels: function (modelObj) {
    this.set("totalLoaded", this.get("totalLoaded") + 1);

    switch(modelObj.name) {
      case "sceneDetails":
        this.set("object3d", modelObj.object3d );
        break;
      default:
        this.setClickData(modelObj.object3d);
        this.get("interactiveObjects").push(modelObj.object3d);
    }

    this.allModelsLoaded();
  },
  allModelsLoaded: function () {

    if (this.get("modelUrls").length === this.get("totalLoaded")) {
      eventController.off(eventController.SCENE_DETAILS_LOADED, this.loadSceneDetailModels, this);

      this.get("object3d").position.y += this.get("parentScenePosition").y;
      _.each(this.get("interactiveObjects"), function (mesh) {
        mesh.position.y += this.get("parentScenePosition").y;
      }, this);

    }
  },
  selectNextObject:function () {
    var nextObject = this.getNextObject(this.get("projectIndex"));
    return nextObject;
  },
  selectPrevObject: function () {
    var prevObject = this.getPrevObject(this.get("projectIndex"));
    return prevObject;
  },
  isFirstClick: function () {
    if (this.get("projectIndex") === null) {
      this.set("projectIndex", 0);
      return true;
    }
    return false;
  },
  getNextObject: function (projectIndex) {
    var iObjsLen = this.get("interactiveObjects").length

    if ( !this.isFirstClick() ) {
      if (iObjsLen - 1 > projectIndex) {
        this.set("projectIndex", this.get("projectIndex") + 1);
      } else {
        this.set("projectIndex", 0);
      }
    }
    return this.get("interactiveObjects")[this.get("projectIndex")];
  },
  getPrevObject:function (projectIndex) {
    var iObjsLen = this.get("interactiveObjects").length

    if ( !this.isFirstClick() ) {
      if (projectIndex >= 1) {
        this.set("projectIndex", projectIndex - 1);
      } else {
        this.set("projectIndex", iObjsLen - 1);
      }
    }
    return this.get("interactiveObjects")[this.get("projectIndex")];
  },
  getPSImages: function () {
    return [];
  },
  setClickData: function () {
    console.log("DEFAULT");
  }
});

module.exports = SceneDetailsBaseModel3d;
