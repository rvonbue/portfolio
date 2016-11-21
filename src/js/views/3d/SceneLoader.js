import THREE from "three";
import TWEEN from "tween.js";

import BaseView from "../BaseView";
import eventController from "../../controllers/eventController";
import navigationList from "../../data/navigationList";
import SceneModelCollection from "../../collections/SceneModelCollection";
import ModelLoader from "../../models/modelLoader";
import utils from "../../util/utils";

import FloorBuilder3d from "./FloorBuilder3d";
import SceneDetailsBuilder3d from "./SceneDetailsBuilder3d";

import SceneDetailsModel from "../../models/sceneDetails/SceneDetailsBaseModel3d";
import WebDevModel3d from "../../models/sceneDetails/WebDevModel3d";
import AnimationModel3d from "../../models/sceneDetails/AnimationModel3d";
import DigitalArtModel3d from "../../models/sceneDetails/DigitalArtModel3d";
import ContactModel3d from "../../models/sceneDetails/ContactModel3d";
import AboutMeModel3d from "../../models/sceneDetails/AboutMeModel3d";

var SceneLoader = BaseView.extend({
  name: null,
  ready: false,
  SCENE_MODEL_NAME: "floor",
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    this.sceneModelCollection = new SceneModelCollection();
    this.modelLoader = new ModelLoader();
    this.addListeners();
    var models = [
      { url: "models3d/ground2.json", name: "ground" },
      { url: "models3d/japanBottomFloor.json", name: "bottomFloor" },
      { url: "models3d/floorJapan.json", name: this.SCENE_MODEL_NAME}
    ];
    _.each(models, function (modelsArrObj) {
      eventController.trigger(eventController.LOAD_JSON_MODEL, modelsArrObj.url, { name: modelsArrObj.name, sceneModelName: null }); //load scene Models
    }, this);
  },
  addListeners: function () {
     eventController.on(eventController.MODEL_LOADED, this.modelLoaded, this );
     eventController.on(eventController.BUILD_SCENE_DETAILS, this.buildSceneDetails, this );
     eventController.once(eventController.ALL_ITEMS_LOADED, this.animateSceneStart, this);
  },
  removeListeners: function () {
    eventController.off(eventController.MODEL_LOADED, this.modelLoaded, this );
    eventController.off(eventController.BUILD_SCENE_DETAILS, this.buildSceneDetails, this );
  },
  startLoadSceneDetails: function (sceneModel) {
    eventController.trigger(eventController.RESET_RAYCASTER, []);   //reset Interactive objects to nothing will loading new ones
    this.setSceneDetails(sceneModel);
  },
  buildSceneDetails: function (sceneModel) {
    var self = this;
    var sceneDetailsModel = this.getSceneDetailsModel(sceneModel);
    var sceneDetailsBuilder3d = new SceneDetailsBuilder3d();

    sceneDetailsBuilder3d.setSceneDetails(sceneDetailsModel);
    sceneModel.set("sceneDetails", sceneDetailsModel); //set sceneModel and toggle show/hide of sceneDetails Model

    eventController.once("ALL_ITEMS_LOADED", function () {
      console.log("all textures and Models Loaded");
      self.allItemsLoaded(sceneModel);
    });

  },
  allItemsLoaded: function (sceneModel) {
    sceneModel.get("sceneDetails").showHide(false , false);
    sceneModel.set({ loading: false, ready: true });

    eventController.trigger(eventController.SCENE_MODEL_READY, sceneModel);
  },
  getSceneDetailsModel: function (sceneModel) {
    // delete modelObj["name"]; // let getSceneDetailsModel set their own names
    var modelObj = {
      parentScenePosition: sceneModel.get("object3d").position,
      floorIndex: sceneModel.get("floorIndex")
    };

    switch(sceneModel.get("name")) { //floorName
      case navigationList[0].name:
        return new WebDevModel3d(modelObj);
      case navigationList[1].name:
        return new AnimationModel3d(modelObj);
      case navigationList[2].name:
        return new DigitalArtModel3d(modelObj);
      case navigationList[3].name:
        return new AboutMeModel3d(modelObj);
      case navigationList[4].name:
        return new ContactModel3d(modelObj);
      default:
        return new SceneDetailsModel(modelObj);
    }
  },
  hideSceneModel: function () {
    var selectedFalse = this.sceneModelCollection.where({ selected: false });
    _.each(selectedFalse, function (sceneModel) {
      // this.fadeMaterials(sceneModel.getAllMaterials(), 0);
      sceneModel.showHide(false);
    }, this);
  },
  getSceneModelInteractiveObjects: function () {
    var objects3d = this.sceneModelCollection
    .where({interactive: true})
    .map(function (model) { return model.get('rayCasterMesh'); });
    return objects3d;
  },
  setInteractiveObjects: function (objects3d) {
    eventController.trigger(eventController.RESET_RAYCASTER, objects3d);
  },
  addNonInteractive: function (obj) {
    obj.interactive = false;
    var sceneModel = this.sceneModelCollection.add(obj); //adding to collection returns sceneModel
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, [sceneModel.get("object3d")]);
  },
  sceneModelLoaded: function (obj) {
    this.createFloors(obj.object3d);

    var object3dArr = this.sceneModelCollection.where({ interactive: true })
    .map(function (scModel, i) { // position floors on top of each other
      var object3d = scModel.get("object3d");
      object3d.position.set(0, i * scModel.getSize().h + 14.75, 0); //TODO: MAGIC NUMBER its the height of the bottom floor
      return object3d;
    });

    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, object3dArr);
    this.setInteractiveObjects(this.getSceneModelInteractiveObjects());
  },
  createFloors: function (object3d) {
    var floorView3d = new FloorBuilder3d();
    _.each(_.clone(navigationList).reverse(), function (navListObj, i) { // clone and reverse Navigation list so buidling stacks from bottom to top
      var sceneModel = this.sceneModelCollection.add(
        {
          name: navListObj.name,
          className: navListObj.className,
          object3d:object3d.GdeepCloneMaterials(),
          floorIndex:i
        }); //THREE JS EXTEND WITH PROTOYTPE deep clone for materials
      floorView3d.addFloorItems(sceneModel, this.modelLoader);
    }, this);

    floorView3d.remove();
    floorView3d = null;
  },
  modelLoaded: function (obj) {
    if (obj.name === this.SCENE_MODEL_NAME) {
      this.sceneModelLoaded(obj);
    } else {
      this.addNonInteractive(obj);
    }
  },
  isSceneSelected: function () {
    var selectedSceneModel = this.sceneModelCollection.findWhere({selected: true});
    if (selectedSceneModel) return selectedSceneModel;
    return false;
  },
  sceneDetailsSelectObject: function (next) {
    var sceneModel = this.isSceneSelected();
    var sdObject;

    if ( sceneModel ) {
      if (next) sdMesh = sceneModel.get("sceneDetails").selectNextObject();
      if (!next) sdMesh = sceneModel.get("sceneDetails").selectPrevObject();
      eventController.trigger(eventController.MOVE_SCENE_SELECTOR, sdMesh);
    }

  },
  animateSceneStart: function () {
    _.each(this.sceneModelCollection.models, function (sceneModel) {
      // this.fadeMaterials(sceneModel.getAllMaterials(), 1);
      sceneModel.showHide(true);
    }, this);
  },
});

module.exports = SceneLoader;
