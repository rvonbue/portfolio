import THREE from "three";
import TWEEN from "tween.js";

import BaseView from "../BaseView";
import eventController from "../../controllers/eventController";
import navigationList from "../../data/navigationList";
import utils from "../../util/utils";

var SceneLoader = BaseView.extend({
  name: null,
  ready: false,
  SCENE_MODEL_NAME: "floor",
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    window.smc = this.sceneModelCollection = options.sceneModelCollection;
    this.addListeners();
  },
  addListeners: function () {
     eventController.on(eventController.RESET_SCENE, this.resetScene, this);

     // hover/click events from the 3d space
     eventController.on(eventController.MOUSE_CLICK_SELECT_OBJECT_3D, this.clickSelectSceneModel, this);
     eventController.on(eventController.HOVER_NAVIGATION, this.setMouseMoveHoverSceneModel, this);

     // hover/click events from the navigation bar
     eventController.on(eventController.SWITCH_PAGE, this.navigationBarSelectSceneModel, this);
     eventController.on(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR, this.setHoverSceneModelNavBar, this);
     eventController.on(eventController.CLICK_RESET_SCENE_DETAILS, this.clickResetSceneDetails, this);
     eventController.on(eventController.SCENE_DETAILS_SELECT_OBJECT, this.sceneDetailsSelectObject, this);
     eventController.on(eventController.TOGGLE_SELECT_SCENE_MODEL, this.toggleSelect, this);
     eventController.on(eventController.SCENE_MODEL_READY, this.sceneModelReady, this);
  },
  removeListeners: function () {
    eventController.off(eventController.RESET_SCENE, this.resetScene, this);

    eventController.off(eventController.MOUSE_CLICK_SELECT_OBJECT_3D, this.clickSelectSceneModel, this);
    eventController.off(eventController.HOVER_NAVIGATION, this.setMouseMoveHoverSceneModel, this);

    eventController.off(eventController.SWITCH_PAGE, this.navigationBarSelectSceneModel, this);
    eventController.off(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR, this.setHoverSceneModelNavBar, this);

    eventController.off(eventController.CLICK_RESET_SCENE_DETAILS, this.clickResetSceneDetails, this);
    eventController.off(eventController.SCENE_DETAILS_SELECT_OBJECT, this.sceneDetailsSelectObject, this);
    eventController.off(eventController.TOGGLE_SELECT_SCENE_MODEL, this.toggleSelect, this);
    eventController.off(eventController.SCENE_MODEL_READY, this.sceneModelReady, this);
  },
  resetScene: function () {
    this.animating = false;
    this.sceneModelCollection.each(function (sceneModel) {
      sceneModel.reset(true);
    });
    this.setInteractiveObjects(this.getSceneModelInteractiveObjects());
  },
  setMouseMoveHoverSceneModel: function (intersect) {
    var isSceneSelected =  this.isSceneSelected();
    if (!isSceneSelected) {
      if (!intersect && this.hoverModel) {
        this.hoverModel.set("hover", false);
        this.hoverModel = null;
        return;
      }
      if (intersect) this.setHoverSceneModel(this.sceneModelCollection.findWhere({ name: intersect.object.name }), true);
    } else {
      var moveSelector = intersect ? intersect.object : null;
      console.log("moveSelector: ", moveSelector);
      eventController.trigger(eventController.MOVE_SCENE_SELECTOR, moveSelector);
    }
  },
  setHoverSceneModelNavBar: function (navListObj, hoverBool) {
    // if ( !this.isSceneSelected()) {
     this.setHoverSceneModel(this.sceneModelCollection.findWhere({ name: navListObj.name }), hoverBool);
    // }
  },
  setHoverSceneModel: function (newHoverModel, hoverBool) { // hoverBool = true when hover is true
    if (!newHoverModel) return;
    if (this.hoverModel && (newHoverModel.cid === this.hoverModel.cid) && hoverBool) {
      return;
    } else if (this.hoverModel){
      this.hoverModel.set("hover", false);
    }
    this.hoverModel = newHoverModel;
    newHoverModel.set("hover", hoverBool);
  },
  clickSelectSceneModel: function (intersectObject) {
    if ( !intersectObject ) return;

    var sceneModel = this.sceneModelCollection.findWhere({ name: intersectObject.object.name });

    if (sceneModel) {
      this.toggleSelectedSceneModel(sceneModel);
    } else {
      this.clickSelectSceneDetails(intersectObject);
    }

  },
  clickSelectSceneDetails: function (intersectObject) {
    var sceneModel = this.isSceneSelected();
    var sceneDetails = sceneModel.get("sceneDetails");
    var clickType = intersectObject.object.clickType;
    var name = intersectObject.object.name;

    switch(clickType) {
      case "photoswipe":
        eventController.trigger(eventController.OPEN_PHOTO_SWIPE, sceneDetails.getPSImages(), intersectObject.object.imageNum);
        break;
      case "video":
        eventController.trigger(eventController.VIDEO_PLAY_PAUSE);
        break;
      default:
        break;
    }
  },
  navigationBarSelectSceneModel: function (sceneModelName) {
    this.toggleSelectedSceneModel(this.sceneModelCollection.findWhere({ name: sceneModelName }));
  },
  getSelectedScene: function () {
    return this.sceneModelCollection.findWhere({ selected: true });
  },
  toggleSelect: function () {
    this.toggleSelectedSceneModel(this.sceneModelCollection.findWhere({selected: true}));
  },
  toggleSelectedSceneModel: function (newSceneModel) {
    if ( !newSceneModel ) return;

    var oldSceneModel = this.getSelectedScene();
    var isSameModel = oldSceneModel && oldSceneModel.cid === newSceneModel.cid;
    var isCameraAnimating = commandController.request(commandController.IS_CAMERA_ANIMATING);
    var isFirstClick = oldSceneModel && !isSameModel && newSceneModel.get("selected") ? true : false;
    var oldSceneModelisReady = oldSceneModel && oldSceneModel.isReady();
    var newSCeneModelisReady = newSceneModel.isReady();

    this.shouldLoadSceneDetails(newSceneModel);

    if (isCameraAnimating) {
      if (oldSceneModel) oldSceneModel.set({ "selected": false }, { silent: true });
      newSceneModel.set("selected", true);
      this.zoomToSelectedSceneModel(newSceneModel, {pathPoints: 2 });
      return;
    }
    if ( isSameModel ) { // same model selected
      console.log("isSameModel", isCameraAnimating);
      if (isCameraAnimating) return;
      if (oldSceneModel.isReady()) { // are sceneDetails loaded
        this.resetSceneDetails(newSceneModel, true);
        oldSceneModel.showHide(true);
      } else {
        this.zoomToSelectedSceneModel(oldSceneModel, {pathPoints: 2 });
      }
      return;
    }

    if ( newSceneModel.isReady() && oldSceneModelisReady ) {
      console.log("newSceneModel.isReady() && oldSceneModelisReady");
      this.toggleSelectedSceneDetails(oldSceneModel, newSceneModel); //fade to new sceneModel
      // this.resetSceneDetails(newSceneModel);
      return;
    }
    if ( !newSceneModel.isReady() && oldSceneModelisReady ) {
      console.log("!newSceneModel.isReady() && oldSceneModelisReady");
      this.toggleSelectedSceneDetails(oldSceneModel, newSceneModel);
      return;
    }

    if ( !newSceneModel.isReady() && !oldSceneModel ) {
      console.log("!newSceneModel.isReady() && !oldSceneModel");
      newSceneModel.set({ selected: true });
      this.zoomToSelectedSceneModel(newSceneModel, {pathPoints: 2 });
      return;
    }


    console.log("-------END------");
    newSceneModel.set({ selected: true });
    this.zoomToSelectedSceneModel(newSceneModel, {pathPoints: 1 });
  },
  shouldLoadSceneDetails: function (newSceneModel) {
    if ( !newSceneModel.get("ready") && !newSceneModel.get("loading")) {
      this.startLoadSceneDetails(newSceneModel);
    }
  },
  startLoadSceneDetails: function (sceneModel) {
    eventController.trigger(eventController.RESET_RAYCASTER, []);   //reset Interactive objects to nothing will loading new ones
    eventController.trigger(eventController.BUILD_SCENE_DETAILS, sceneModel);
  },
  clickResetSceneDetails: function () {
    var selectedScene = this.isSceneSelected();
    if (selectedScene) {
        this.resetSceneDetails(selectedScene);
    }
  },
  resetSceneDetails: function ( sceneModel, moveCamera ) {
    eventController.trigger(eventController.TOGGLE_AMBIENT_LIGHTING, sceneModel.getAmbientLighting());
    eventController.trigger(eventController.RESET_RAYCASTER, sceneModel.get("sceneDetails").get("interactiveObjects"));
    eventController.trigger(eventController.TOGGLE_SCENE_DETAILS_CONTROLS, sceneModel.get("className"));
    if (moveCamera === true ) {
      eventController.trigger(eventController.SET_CAMERA_AND_TARGET, sceneModel.getCameraPosition());
    }
  },
  toggleSelectedSceneDetails: function (oldSceneModel, newSceneModel) {
    var fadeTime = utils.getAnimationSpeed().materialsFade;
    var self = this;
    console.log("toggleSelectedSceneDetails");
    oldSceneModel.fadeMaterials(0);
    oldSceneModel.setSelectedDelay(false, fadeTime);
    newSceneModel.setSelectedDelay(true, fadeTime);

    setTimeout(function () {
      self.resetSceneDetails(newSceneModel, true);
      newSceneModel.fadeMaterials(1);
    }, fadeTime);

  },
  zoomToSelectedSceneModel: function (sceneModel, options) {
    eventController.trigger(eventController.SCENE_MODEL_SELECTED, sceneModel, options);  //zoom to selected model
  },
  hideSceneModels: function () {
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
  isSceneSelected: function () {
    var selectedSceneModel = this.sceneModelCollection.findWhere({selected: true});
    if (selectedSceneModel) return selectedSceneModel;
    return false;
  },
  sceneDetailsSelectObject: function (next) {
    var sceneModel = this.isSceneSelected();

    if ( sceneModel ) {
      var sceneDetailsModel = sceneModel.get("sceneDetails")
      var sdObject = next ? sceneDetailsModel.selectNextObject() : sceneDetailsModel.selectPrevObject();
      eventController.trigger(eventController.MOVE_SCENE_SELECTOR, sdObject);
    } else {
      var newHoverModel = this.getNextSceneModel(next);
      this.setHoverSceneModel(newHoverModel, true);
    }

  },
  getNextSceneModel: function (nextOrPrev) {
    var hoverModel = this.sceneModelCollection.findWhere({ hover: true });
    var numFloor = this.sceneModelCollection.where({ interactive: true }).length;
    var newFloorIndex;

    if (hoverModel) {
      var floorIndex = hoverModel.get("floorIndex")
      if ( nextOrPrev ) {
        if ( floorIndex > 0 ) return this.sceneModelCollection.findWhere({ floorIndex: floorIndex - 1});
      } else {
        newFloorIndex = floorIndex < numFloor - 1 ? floorIndex + 1 : 0;
        return this.sceneModelCollection.findWhere({ floorIndex: newFloorIndex});
      }
    }

    return this.sceneModelCollection.findWhere({ floorIndex: numFloor - 1 });;
  },
  sceneModelReady: function (sceneModel) {
    var isCameraAnimating = commandController.request(commandController.IS_CAMERA_ANIMATING);

    if (isCameraAnimating) {
      eventController.once(eventController.CAMERA_FINISHED_ANIMATION, function () {
        this.addSceneDetailsToScene(sceneModel);
      }, this);
    } else {
      this.addSceneDetailsToScene(sceneModel);
    }

  },
  addSceneDetailsToScene: function (sceneModel) {
    var selectedSceneModel = this.getSelectedScene();
    var timeOpenDoors, self = this;

    sceneModel.showHide(true, true);
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, sceneModel.get("sceneDetails").getAllMeshes());
    this.resetSceneDetails(sceneModel, false);

    setTimeout( function () {
      timeOpenDoors = sceneModel.openDoors(true);
      setTimeout( function () {
        if ( sceneModel.cid === selectedSceneModel.cid ) {
          self.zoomToSelectedSceneModel(sceneModel, {pathPoints: 1 });
          self.hideSceneModels();
        }
      }, timeOpenDoors);
    }, 1500);
  }
});

module.exports = SceneLoader;
