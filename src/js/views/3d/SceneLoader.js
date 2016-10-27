import BaseView from "../BaseView";
import eventController from "../../controllers/eventController";
import navigationList from "../../data/navigationList";
import SceneModel from "../../models/sceneModel";
import SceneModelCollection from "../../collections/SceneModelCollection";
import utils from "../../util/utils";
import THREE from "three";
import TWEEN from "tween.js";

import ModelLoader from "../../models/modelLoader";
import FloorBuilder3d from "./FloorBuilder3d";
import SceneDetailsBuilder3d from "./SceneDetailsBuilder3d";
import SceneDetailsModel from "../../models/sceneDetails/SceneDetailsBaseModel3d";
import WebDevModel3d from "../../models/sceneDetails/WebDevModel3d";
import AnimationModel3d from "../../models/sceneDetails/AnimationModel3d";

var SceneLoader = BaseView.extend({
  name: null,
  ready: false,
  TOTAL_MODELS: 0, // set in intialize function;
  TOTAL_MODELS_LOADED: 0,
  SCENE_MODEL_NAME: "floor",
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    window.smc = this.sceneModelCollection = new SceneModelCollection();
    this.modelLoader = new ModelLoader();
    this.addListeners();
    var models = [
      { url: "models3d/japanBottomFloor.json", name: "bottomFloor" },
      { url: "models3d/ground.json", name: "ground" },
      { url: "models3d/floorJapan.json", name: this.SCENE_MODEL_NAME}
    ];
    this.TOTAL_MODELS = models.length;
    _.each(models, function (modelsArrObj) {
      eventController.trigger(eventController.LOAD_JSON_MODEL, modelsArrObj.url, { name: modelsArrObj.name, sceneModelName: null }); //load scene Models
    }, this);
  },
  addListeners: function () {
     eventController.on(eventController.MODEL_LOADED, this.modelLoaded, this );
     eventController.on(eventController.MOUSE_CLICK_SELECT_OBJECT_3D, this.clickSelectSceneModel, this);
     eventController.on(eventController.SWITCH_PAGE, this.navigationBarSelectSceneModel, this);
     eventController.on(eventController.CAMERA_START_ANIMATION, this.cameraStartAnimatingToSceneDetails, this);
     eventController.on(eventController.HOVER_NAVIGATION, this.setMouseMoveHoverSceneModel, this);
     eventController.on(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR, this.setHoverSceneModelNavBar, this);
     eventController.on(eventController.RESET_SCENE, this.resetScene, this);
  },
  removeListeners: function () {
    eventController.off(eventController.MODEL_LOADED, this.modelLoaded, this );
    eventController.off(eventController.MOUSE_CLICK_SELECT_OBJECT_3D, this.clickSelectSceneModel, this);
    eventController.off(eventController.SWITCH_PAGE, this.navigationBarSelectSceneModel, this);
    eventController.off(eventController.CAMERA_START_ANIMATION, this.cameraStartAnimatingToSceneDetails, this);
    eventController.off(eventController.HOVER_NAVIGATION, this.setMouseMoveHoverSceneModel, this);
    eventController.off(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR, this.setHoverSceneModelNavBar, this);
    eventController.off(eventController.RESET_SCENE, this.resetScene, this);
  },
  resetScene: function () {
    this.sceneModelCollection.each(function (sceneModel) {
      sceneModel.reset(true);
    });
    this.setInteractiveObjects();
  },
  setMouseMoveHoverSceneModel: function (intersect) {
    if (!intersect && this.hoverModel) {
      this.hoverModel.reset(true);
      this.hoverModel = null;
      return;
    }
    if (intersect) this.setHoverSceneModel(this.sceneModelCollection.findWhere({ name: intersect.object.name }), true);
  },
  setHoverSceneModelNavBar: function (modelName, hoverBool) {
    this.setHoverSceneModel(this.sceneModelCollection.findWhere({ name: modelName }), hoverBool);
  },
  setHoverSceneModel: function (newHoverModel, hoverBool) { // hoverBool = true when hover is true
    if (!newHoverModel) return;
    if (this.hoverModel && (newHoverModel.cid === this.hoverModel.cid)) {
      return;
    } else if (this.hoverModel){
      this.hoverModel.set("hover", false);
    }
    this.hoverModel = newHoverModel;
    newHoverModel.set("hover", hoverBool);
  },
  clickSelectSceneModel: function (intersectObject) {
    if ( !intersectObject ) return;
    var name = intersectObject.object.name;
    this.toggleSelectedSceneModel(this.sceneModelCollection.findWhere({ name: name }));
  },
  navigationBarSelectSceneModel: function (index) {
    if (isNaN(index)) return;
    this.toggleSelectedSceneModel(this.sceneModelCollection.findWhere({ name: navigationList[index] }));
  },
  toggleSelectedSceneModel: function (newSceneModel) {
    var prevSceneModel = this.sceneModelCollection.findWhere({ selected: true });
    if (prevSceneModel && prevSceneModel.cid !== newSceneModel.cid) {
      this.deselectSceneModel(prevSceneModel);
    }

    if ( !newSceneModel ) return;  //if model doesn't exist for some reason can probably remove

    if ( newSceneModel.get("ready") === false && !newSceneModel.get("sceneDetails") ) this.loadSceneDetails(newSceneModel);
    if ( !newSceneModel.get({ selected:false }) ) newSceneModel.set({ selected:true });
    this.zoomToSelectedSceneModel(newSceneModel);
  },
  zoomToSelectedSceneModel: function (sceneModel) {
    eventController.trigger(eventController.RESET_RAYCASTER, []);   //reset Interactive objects to nothing will loading new ones
    eventController.trigger(eventController.SCENE_MODEL_SELECTED, sceneModel);  //zoom to selected model
  },
  loadSceneDetails: function (newSceneModel, sceneDetailsName) {
    eventController.once(eventController.SCENE_DETAILS_LOADED, this.sceneDetailsLoaded, this);
    var sceneDetailsUrl = 'models3d/floor' + newSceneModel.get("floorIndex") + '/sceneDetails.json';
    eventController.trigger(eventController.LOAD_JSON_MODEL, sceneDetailsUrl,
      { name: "sceneDetails", sceneModelName: newSceneModel.get("name") }
    );
  },
  sceneDetailsLoaded: function (modelObj) {
    var sceneModel = this.sceneModelCollection.findWhere({ name: modelObj.sceneModelName });
    modelObj.sceneModel = sceneModel;

    var sceneDetailsModel = this.getSceneDetailsModel(modelObj);
    var sceneDetailsBuilder3d = new SceneDetailsBuilder3d();
    sceneDetailsModel.set("sceneLights", sceneDetailsBuilder3d.getPointLights(sceneDetailsModel));
    sceneModel.set("sceneDetails", sceneDetailsModel);
    if (!sceneModel.get("selected")) sceneDetailsModel.showHide(false);
    this.addSceneDetailsToScene(sceneDetailsModel); //add to stage so they rendered
    this.zoomToSelectedSceneModel(sceneModel);
  },
  addSceneDetailsToScene: function (sceneDetailsModel) {
    var sceneDetail_lights = sceneDetailsModel.get("sceneLights");
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, sceneDetail_lights);
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, sceneDetail_lights.map( function (light) {
      return new THREE.PointLightHelper(light, 0.25);
    }));
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, [sceneDetailsModel.get("object3d")]);
    eventController.trigger(eventController.TOGGLE_AMBIENT_LIGHTING, sceneDetailsModel.get("intialAmbientLights"));
  },
  getSceneDetailsModel: function (modelObj) {
    delete modelObj["name"]; // let models set their own names
    switch(modelObj.sceneModelName) { //floorName
      case navigationList[0]:
        return new WebDevModel3d(modelObj);
      case navigationList[1]:
        return new AnimationModel3d(modelObj);
      default:
        return new SceneDetailsModel(modelObj);
    }
  },
  deselectSceneModel: function (oldSceneModel) {
    if ( oldSceneModel ) oldSceneModel.reset(false);
  },
  hideSceneModel: function (sceneModelArr) {
    var selectedFalse = this.sceneModelCollection.where({ selected: false });
    _.each(selectedFalse, function (sceneModel) {
      // this.fadeMaterials(sceneModel.getAllMaterials(), 0);
      sceneModel.showHide(false);
    }, this);
  },
  fadeMaterials: function (materials, opacityEnd) {
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
  setInteractiveObjects: function () {
    var objects3d = this.sceneModelCollection
    .where({interactive: true})
    .map(function (model) { return model.get('object3d'); });
    eventController.trigger(eventController.RESET_RAYCASTER, objects3d);
  },
  cameraStartAnimatingToSceneDetails: function () {
      this.hideSceneModel();
      var selectedSceneModel = this.sceneModelCollection.findWhere({ selected: true });
      selectedSceneModel.startScene();
    // var selectedModel = this.sceneModelCollection.findWhere({ selected: true });
    // selectedModel.toggleDoors(true);
  },
  animateSceneStart: function () {
    _.each(this.sceneModelCollection.models, function (sceneModel) {
      // this.fadeMaterials(sceneModel.getAllMaterials(), 1);
      sceneModel.showHide(true);
    }, this);
  },
  createFloors: function (object3d) {
    var floorView3d = new FloorBuilder3d();
    _.each(_.clone(navigationList).reverse(), function (floorName, i) { // clone and reverse Navigation list so buidling stacks from bottom to top
      var sceneModel = new SceneModel({ name:floorName, object3d:object3d.GdeepCloneMaterials(), floorIndex: i }); //THREE JS EXTEND WITH PROTOYTPE deep clone for materials

      floorView3d.addFloorItems(sceneModel, this.modelLoader);
      this.sceneModelCollection.add(sceneModel);
    }, this);
  },
  addNonInteractive: function (obj) {
    obj.interactive = false;
    var sceneModel = this.sceneModelCollection.add(obj); //adding to collection returns sceneModel
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, [sceneModel.get("object3d")]);
  },
  sceneModelLoaded: function (obj) {
    var startingHeight = 14.75; //TODO: MAGIC NUMBER its the height of the bottom floor
    var object3dArr = [];

    this.createFloors(obj.object3d);
    var sceneModels = this.sceneModelCollection.where({ interactive: true });

    sceneModels.forEach(function (scModel, i) { // position floors on top of each other
      var object3d = scModel.get("object3d");
      object3d.position.set(0, i * scModel.getSize().h + startingHeight, 0);
      object3dArr.push(object3d);
    });

    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, object3dArr);
    this.setInteractiveObjects();
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
      this.animateSceneStart();
    }
  },
});

module.exports = SceneLoader;
