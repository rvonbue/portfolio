import THREE from "three";
import TWEEN from "tween.js";

import BaseView from "../BaseView";
import eventController from "../../controllers/eventController";
import navigationList from "../../data/navigationList";
import SceneModel from "../../models/sceneModel";
import SceneModelCollection from "../../collections/SceneModelCollection";
import ModelLoader from "../../models/modelLoader";
import utils from "../../util/utils";

import FloorBuilder3d from "./FloorBuilder3d";
import SceneDetailsBuilder3d from "./SceneDetailsBuilder3d";

import SceneDetailsModel from "../../models/sceneDetails/SceneDetailsBaseModel3d";
import WebDevModel3d from "../../models/sceneDetails/WebDevModel3d";
import AnimationModel3d from "../../models/sceneDetails/AnimationModel3d";
import DigitalArtModel3d from "../../models/sceneDetails/DigitalArtModel3d";

var SceneLoader = BaseView.extend({
  name: null,
  ready: false,
  SCENE_MODEL_NAME: "floor",
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    window.smc = this.sceneModelCollection = new SceneModelCollection();
    this.modelLoader = new ModelLoader();
    this.addListeners();
    var models = [
      { url: "models3d/ground.json", name: "ground" },
      { url: "models3d/japanBottomFloor.json", name: "bottomFloor" },
      { url: "models3d/floorJapan.json", name: this.SCENE_MODEL_NAME}
    ];
    _.each(models, function (modelsArrObj) {
      eventController.trigger(eventController.LOAD_JSON_MODEL, modelsArrObj.url, { name: modelsArrObj.name, sceneModelName: null }); //load scene Models
    }, this);
  },
  addListeners: function () {
     eventController.on(eventController.SCENE_DETAILS_LOADED, this.sceneDetailsLoaded, this);
     eventController.on(eventController.MODEL_LOADED, this.modelLoaded, this );
     eventController.on(eventController.RESET_SCENE, this.resetScene, this);
     // hover - click events from the 3d space
     eventController.on(eventController.MOUSE_CLICK_SELECT_OBJECT_3D, this.clickSelectSceneModel, this);
     eventController.on(eventController.HOVER_NAVIGATION, this.setMouseMoveHoverSceneModel, this);
     // hover - click events from the navigation bar
     eventController.on(eventController.SWITCH_PAGE, this.navigationBarSelectSceneModel, this);
     eventController.on(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR, this.setHoverSceneModelNavBar, this);

     eventController.on(eventController.CAMERA_FINISHED_ANIMATION, this.cameraFinishAnimating, this);
     eventController.on(eventController.CAMERA_START_ANIMATION, this.cameraStartAnimating, this);
     eventController.on(eventController.SCENE_DETAILS_SELECT_OBJECT, this.sceneDetailsSelectObject, this);
     eventController.once(eventController.ALL_ITEMS_LOADED, this.animateSceneStart, this);
  },
  removeListeners: function () {
    eventController.off(eventController.SCENE_DETAILS_LOADED, this.sceneDetailsLoaded, this);
    eventController.off(eventController.MODEL_LOADED, this.modelLoaded, this );
    eventController.off(eventController.RESET_SCENE, this.resetScene, this);

    eventController.off(eventController.MOUSE_CLICK_SELECT_OBJECT_3D, this.clickSelectSceneModel, this);
    eventController.off(eventController.HOVER_NAVIGATION, this.setMouseMoveHoverSceneModel, this);

    eventController.off(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR, this.setHoverSceneModelNavBar, this);
    eventController.off(eventController.SWITCH_PAGE, this.navigationBarSelectSceneModel, this);

    eventController.off(eventController.CAMERA_START_ANIMATION, this.cameraStartAnimating, this);
    eventController.off(eventController.SCENE_DETAILS_SELECT_OBJECT, this.sceneDetailsSelectObject, this);
  },
  resetScene: function () {
    this.sceneModelCollection.each(function (sceneModel) {
      sceneModel.reset(true);
    });
    this.setInteractiveObjects(this.getSceneModelInteractiveObjects());
  },
  setMouseMoveHoverSceneModel: function (intersect) {
    if (!intersect && this.hoverModel) {
      this.hoverModel.set("hover", false);
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
    var sceneModel = this.isSceneSelected();
    var intersectName = intersectObject.object.name;
    if (sceneModel) {
       eventController.trigger(eventController.OPEN_PHOTO_SWIPE,
          sceneModel.get("sceneDetails").getPSImages(),
          intersectObject.object.imageNum
       );
    } else {
      this.toggleSelectedSceneModel(this.sceneModelCollection.findWhere({ name: intersectName }));
    }

  },
  navigationBarSelectSceneModel: function (index) {
    this.toggleSelectedSceneModel(this.sceneModelCollection.findWhere({ name: navigationList[index].name }));
  },
  getSelectedScene: function () {
    return this.sceneModelCollection.findWhere({ selected: true });
  },
  toggleSelectedSceneModel: function (newSceneModel) {
    var oldSceneModel = this.getSelectedScene();
    var isOldModelNewModel = oldSceneModel && oldSceneModel.cid === newSceneModel.cid;

    if ( !newSceneModel.get("ready") && !newSceneModel.get("loading")){
      eventController.trigger(eventController.RESET_RAYCASTER, []);   //reset Interactive objects to nothing will loading new ones
      this.loadSceneDetails(newSceneModel);
    }

    if (isOldModelNewModel && oldSceneModel.isReady()) { //same scene Selected just reset sceneDetails lighting,camera,raycaster
      this.enteringSceneDetails(newSceneModel);
      return;
    }

    if (oldSceneModel && newSceneModel) {
        this.unselectSceneModel(oldSceneModel);
        setTimeout(function () {
          eventController.trigger(eventController.RESET_SCENE_DETAILS, newSceneModel);
          newSceneModel.set({ selected:true });
          newSceneModel.fadeMaterials(1);
        }, utils.getAnimationSpeed().materialsFade);
        return;
    } else {
      newSceneModel.set({ selected:true });
      this.zoomToSelectedSceneModel(newSceneModel);
    }


    // if (newSceneModel.isReady()) this.enteringSceneDetails(newSceneModel);

  },
  unselectSceneModel: function (sceneModel) {
    if (sceneModel) {
      sceneModel.fadeMaterials(0);
    }
  },
  selectSceneModel: function () {

  },
  resetSceneDetails: function (sceneModel) {
    // eventController.trigger(eventController.RESET_SCENE_DETAILS, sceneModel);  //resetSceneDetails lighting and camera
    if (sceneModel.get("ready") && !sceneModel.get("loading")) {
      var sceneDetails = sceneModel.get("sceneDetails");

    }
  },
  zoomToSelectedSceneModel: function (sceneModel) {
    eventController.trigger(eventController.SCENE_MODEL_SELECTED, sceneModel);  //zoom to selected model
  },
  loadSceneDetails: function (newSceneModel) {
    var sceneDetailsUrl = 'models3d/floor' + newSceneModel.get("floorIndex") + '/sceneDetails.json';
    eventController.trigger(eventController.LOAD_JSON_MODEL, sceneDetailsUrl,
      { name: "sceneDetails", sceneModelName: newSceneModel.get("name") }
    );
  },
  sceneDetailsLoaded: function (modelObj) {
    eventController.once(eventController.ALL_ITEMS_LOADED, this.allItemsLoaded, this);
    var sceneModel = this.sceneModelCollection.findWhere({ name: modelObj.sceneModelName });
    modelObj.parentScenePosition = sceneModel.get("object3d").position;

    var sceneDetailsModel = this.getSceneDetailsModel(modelObj);
    var sceneDetailsBuilder3d = new SceneDetailsBuilder3d();
    sceneDetailsBuilder3d.setSceneDetails(sceneDetailsModel, this.modelLoader);

    sceneModel.set("sceneDetails", sceneDetailsModel); //set sceneModel and toggle show/hide of sceneDetails Model
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, sceneDetailsModel.getAllMeshes()); //add to stage so get they rendered
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, sceneDetailsModel.get("sceneLights").map( function (light) {
      return new THREE.PointLightHelper(light, 0.25);
    }));
  },
  allItemsLoaded: function () {
    console.log("---ALL ITEMS LOADED---");
    var sceneModelWithDetails = this.sceneModelCollection.where({ loading: true });
    _.each(sceneModelWithDetails, function (sceneModel) {
      sceneModel.set("loading", false);
      sceneModel.get("sceneDetails").showHide(false , sceneModel.get("selected"));
    });
    var sceneModel = this.isSceneSelected();
    if (sceneModel) sceneModel.openDoors(true);
    // this.cameraFinishAnimating();
  },
  enteringSceneDetails: function (sceneModel) {
    console.log("enteringSceneDetails");
    this.hideSceneModel(); //hide all non selected Models
    var sceneDetails = sceneModel.get("sceneDetails");
    setTimeout(function () {
      sceneModel.startScene(); //hide 3d text and toggle off outdoor lights
    }, 500);
    eventController.trigger(eventController.TOGGLE_AMBIENT_LIGHTING, sceneDetails.get("intialAmbientLights"));
    eventController.trigger(eventController.RESET_RAYCASTER, sceneDetails.get("interactiveObjects"));
    eventController.trigger(eventController.TOGGLE_SCENE_DETAILS_CONTROLS, sceneModel.get("className"));
    this.zoomToSelectedSceneModel(sceneModel);
    sceneModel.get("sceneDetails").showHide(true , sceneModel.get("selected"));
  },
  cameraFinishAnimating: function () {
    console.log("cameraFinishAnimating");
    var sceneModel = this.isSceneSelected();
    if (sceneModel && sceneModel.isReady()) {
      this.enteringSceneDetails(sceneModel);
    }
  },
  cameraStartAnimating: function () {
    // console.log("cameraStartAnimating");

  },
  getSceneDetailsModel: function (modelObj) {
    delete modelObj["name"]; // let getSceneDetailsModel set their own names
    switch(modelObj.sceneModelName) { //floorName
      case navigationList[0].name:
        return new WebDevModel3d(modelObj);
      case navigationList[1].name:
        return new AnimationModel3d(modelObj);
      case navigationList[2].name:
        return new DigitalArtModel3d(modelObj);
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
  animateSceneStart: function () {
    _.each(this.sceneModelCollection.models, function (sceneModel) {
      // this.fadeMaterials(sceneModel.getAllMaterials(), 1);
      sceneModel.showHide(true);
    }, this);
  },
  isSceneSelected: function () {
    var selectedSceneModel = this.sceneModelCollection.findWhere({selected: true});
    if (selectedSceneModel) return selectedSceneModel;
    return false;
  },
  sceneDetailsSelectObject: function (next) {
    var sceneModel = this.isSceneSelected();
    if ( sceneModel ) {
      sceneModel.get("sceneDetails").selectNext(next);
    }
  }
});

module.exports = SceneLoader;
