import BaseView from "../BaseView";
import eventController from "../../controllers/eventController";
import navigationList from "../../data/navigationList";
import SceneModel from "../../models/sceneModel";
import SceneModelCollection from "../../collections/SceneModelCollection";
import utils from "../../util/utils";
import THREE from "three";
import TWEEN from "tween.js";

import ModelLoader from "../../models/modelLoader";
import FloorView3d from "./FloorView3d";

var SceneLoader = BaseView.extend({
  name: null,
  ready: false,
  TOTAL_MODELS: 0, // set in intialize function;
  TOTAL_MODELS_LOADED: 0,
  SCENE_MODEL_NAME: "floor",
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    this.sceneModelCollection = new SceneModelCollection();
    this.modelLoader = new ModelLoader();
    this.addListeners();
    var models = [
      { url: "models3d/floorJapan.json", name: this.SCENE_MODEL_NAME},
      { url: "models3d/japanBottomFloor.json", name: "bottomFloor" },
      { url: "models3d/ground.json", name: "ground" }
    ];
    this.TOTAL_MODELS = models.length;
    _.each(models, function (modelsArrObj) {
      eventController.trigger(eventController.LOAD_JSON_MODEL, modelsArrObj.url, { name: modelsArrObj.name }); //load scene Model
    });
  },
  addListeners: function () {
     eventController.on(eventController.MODEL_LOADED, this.modelLoaded, this );
     eventController.on(eventController.MOUSE_CLICK_SELECT_OBJECT_3D, this.clickSelectSceneModel, this);
     eventController.on(eventController.SWITCH_PAGE, this.navigationBarSelectSceneModel, this);
     eventController.on(eventController.CAMERA_FINISHED_ANIMATION, this.cameraFinishedAnimation, this);
     eventController.on(eventController.HOVER_NAVIGATION, this.setHoverSceneModel, this);
     eventController.on(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR, this.setHoverSceneModelNavBar, this);
     eventController.on(eventController.RESET_SCENE, this.resetScene, this);
  },
  removeListeners: function () {
    eventController.off(eventController.MODEL_LOADED, this.modelLoaded, this );
    eventController.off(eventController.MOUSE_CLICK_SELECT_OBJECT_3D, this.clickSelectSceneModel, this);
    eventController.off(eventController.SWITCH_PAGE, this.navigationBarSelectSceneModel, this);
    eventController.off(eventController.CAMERA_FINISHED_ANIMATION, this.cameraFinishedAnimation, this);
    eventController.off(eventController.HOVER_NAVIGATION, this.setHoverSceneModel, this);
    eventController.off(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR, this.setHoverSceneModelNavBar, this);
    eventController.off(eventController.RESET_SCENE, this.resetScene, this);
  },
  resetScene: function () {
    this.sceneModelCollection.each(function (sceneModel) {
      sceneModel.reset();
    });
    this.setInteractiveObjects();
  },
  setHoverSceneModel: function (intersect) {
    if (!intersect) {
      this.setAllHoverFalse();
      return;
    }
    this.setHoverSceneModelNavBar(intersect.object.name, true);
  },
  setHoverSceneModelNavBar: function (modelName, hoverBool) { // hoverBool = true when hover is true
    var newHoverModel = this.sceneModelCollection.findWhere({ name: modelName });
    if (this.hoverModel) {
      this.hoverModel.set("hover", false);
    }
    this.hoverModel = newHoverModel;
    newHoverModel.set("hover", hoverBool);
  },
  setAllHoverFalse: function () {
    _.each(this.sceneModelCollection.find({ hover: true }), function (sceneModel) {
      sceneModel.set("hover", false);
    });
    if (this.hoverModel) this.hoverModel = null;
  },
  clickSelectSceneModel: function (intersectObject) {
    if ( !intersectObject ) return;
    this.toggleSelectedSceneModel(intersectObject.object.name);
  },
  navigationBarSelectSceneModel: function (index) {
    if (isNaN(index)) return;
    this.toggleSelectedSceneModel(navigationList[index]);
  },
  toggleSelectedSceneModel: function (sceneModelName) {
    this.deselectSceneModel();
    var newSceneModel = this.sceneModelCollection.findWhere({ name: sceneModelName })
    if ( newSceneModel ) {
      newSceneModel.set({ selected:true });
      this.hideSceneModel(this.sceneModelCollection.where({ selected: false }));
      eventController.trigger(eventController.RESET_RAYCASTER, []);
      eventController.trigger(eventController.SCENE_MODEL_SELECTED, newSceneModel);  //zoom to selected model
    }
  },
  deselectSceneModel: function () {
    var oldSceneModel = this.sceneModelCollection.findWhere({ selected: true});
    if ( oldSceneModel ) oldSceneModel.reset();
  },
  hideSceneModel: function (sceneModelArr) {
    console.log("hideSceneModela");
    _.each(sceneModelArr, function (sceneModel) {
      this.fadeMaterials(sceneModel.getAllMaterials(), 0);
    }, this);
  },
  animateSceneStart: function () {
    _.each(this.sceneModelCollection.models, function (sceneModel) {
      // this.fadeMaterials(sceneModel.getAllMaterials(), 1);
      sceneModel.showHide(true);
    }, this);
  },
  fadeMaterials: function (materials, opacityEnd) {
    console.log("animateSceneStart", materials);
    _.each(materials, function (material) {
      material.transparent = true;
      var tween = new TWEEN.Tween(material)
      .to({ opacity: opacityEnd }, utils.getAnimationSpeed.fade)
      .onComplete(function () {
        if ( opacityEnd === 1  && !material.alwaysTransparent ) material.transparent = false;
      })
      .start();
    });
  },
  modelLoaded: function (obj) {
    if (obj.name === this.SCENE_MODEL_NAME) {
      this.sceneModelLoaded(obj);
    } else {
      this.addNonInteractive(obj);
    }

    ++this.TOTAL_MODELS_LOADED;
    this.checkAllModelsLoaded();
  },
  checkAllModelsLoaded: function () {
    if ( this.TOTAL_MODELS_LOADED === this.TOTAL_MODELS) {
      console.log("All models loaded");
      this.animateSceneStart();
    }
  },
  setInteractiveObjects: function () {
    var objects3d = this.sceneModelCollection.where({interactive: true}).map(function (model) {
      return model.get('object3d');
    });
    eventController.trigger(eventController.RESET_RAYCASTER, objects3d);
  },
  sceneModelLoaded: function (obj) {
    var object3d = obj.object3d;

    this.createFloors(object3d);
    var startingHeight = 7;
    var sceneModels = this.sceneModelCollection.where({ interactive: true });
    var object3dArr = [];
    sceneModels.forEach(function (scModel, i) { // position floors on top of each other
      var object3d = scModel.get("object3d");
      var floorHeight =  Math.abs(object3d.geometry.boundingBox.max.y) + Math.abs(object3d.geometry.boundingBox.min.y);
      object3d.position.set(0, i * floorHeight + startingHeight, 0);
      object3dArr.push(object3d);
    });

    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, object3dArr);
    this.setInteractiveObjects();
  },
  createFloors: function (object3d) {
    var floorView3d = new FloorView3d();
    _.each(_.clone(navigationList).reverse(), function (floorName) { // clone and reverse Navigation list so buidling stacks from bottom to top
      var sceneModel = new SceneModel({ name: floorName, object3d: object3d.GdeepCloneMaterials() }); //THREE JS EXTEND WITH PROTOYTPE deep clone for materials
      floorView3d.addFloorItems(sceneModel, this.modelLoader);
      this.sceneModelCollection.add(sceneModel);
    }, this);
  },
  selectFloor: function (closestObject) {
    if (closestObject) {
      this.selectedFloor = this.sceneModelCollection.findWhere({name: closestObject.object.name});
      this.selectedFloor.set("selected", true);
    } else if (this.selectedFloor) {
      this.selectedFloor.set("selected", false);
      this.selectedFloor = null;
    }
  },
  cameraFinishedAnimation: function () {
    console.log("cameraFinishedAnimation:");
    var selectedModel = this.sceneModelCollection.findWhere({ selected: true });
    console.log("selectedModel: :", selectedModel);
    selectedModel.toggleDoors(true);
    this.hideSceneModel(this.sceneModelCollection.where({ selected: false }));
  },
  addNonInteractive: function (obj) {
    obj.interactive = false;
    var sceneModel = this.sceneModelCollection.add(obj); //adding to collection returns sceneModel
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, [sceneModel.get("object3d")]);
  }
});

module.exports = SceneLoader;
