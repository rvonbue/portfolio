import THREE from "three";
import TWEEN from "tween.js";

import BaseView from "../BaseView";
import eventController from "../../controllers/eventController";
import navigationList from "../../data/navigationList";
import utils from "../../util/utils";

var SceneSelector = BaseView.extend({
  name: null,
  ready: false,
  SCENE_MODEL_NAME: "floor",
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    window.smc = this.sceneModelCollection = options.sceneModelCollection;
    this.addListeners();
  },
  resetScene: function () {
    this.animating = false;
    this.sceneModelCollection.each(function (sceneModel) { sceneModel.reset(true); });
    this.setInteractiveObjects(this.getSceneModelInteractiveObjects());
  },
  setMouseMoveHoverSceneModel: function (intersect) {
    var isSceneSelected =  this.isSceneSelected();
    if (!isSceneSelected) {
      if (!intersect && this.hoverModel) {
        this.clearHoverModel();
        return;
      }
      if (intersect) this.setHoverSceneModel(this.sceneModelCollection.findWhere({ name: intersect.object.name }), true);
    } else {
      var moveSelector = intersect ? intersect.object : null;
      eventController.trigger(eventController.MOVE_SCENE_SELECTOR, moveSelector);
    }
  },
  clearHoverModel: function () {
    this.hoverModel.set("hover", false);
    this.hoverModel = null;
  },
  setHoverSceneModelNavBar: function (navListObj, hoverBool) {
    if ( navListObj) {
     this.setHoverSceneModel(this.sceneModelCollection.findWhere({ name: navListObj.name }), hoverBool);
   } else {
     var hoveredScenes = this.sceneModelCollection.where({ hover: true });
     _.each( hoveredScenes, function (model) {
       model.set("hover", false);
     });
   }
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
    var action = intersectObject.object.clickData.action;

    switch(action) {
      case "photoswipe":
        eventController.trigger(eventController.OPEN_PHOTO_SWIPE,
          sceneModel.get("sceneDetails").getPSImages(),
          intersectObject.object.clickData.imageNum
        );
        break;
      case "video":
        eventController.trigger(eventController.VIDEO_PLAY_PAUSE);
        break;
      case "linkI":
        eventController.trigger(eventController.OPEN_PHOTO_SWIPE,
          [
            { src: "./other/Resume-RichardvonBuelowDec2016-1.png" , w: 1700, h: 2200 },
            { src: "./other/Resume-RichardvonBuelowDec2016-2.png" , w: 1700, h: 2200 }
          ],
          intersectObject.object.clickData.imageNum
        );
        break;
      case "link":
        window.open("http://" + intersectObject.object.clickData.url);
        break;
      default:
        console.log("action", action);
        break;
    }
  },
  navigationBarSelectSceneModel: function (index) {
    var name = navigationList[index].name;
    this.toggleSelectedSceneModel(this.sceneModelCollection.findWhere({ name: name }));
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
    var newSceneModelisReady = newSceneModel.isReady();

    this.shouldLoadSceneDetails(newSceneModel);

    if (isCameraAnimating) {
      if (oldSceneModel) oldSceneModel.set({ "selected": false }, { silent: true });
      newSceneModel.set("selected", true);
      this.zoomToSelectedSceneModel(newSceneModel);
      return;
    }

    if ( isSameModel ) { console.log("1 --- isSameModel", isCameraAnimating); // same model selected
      if (isCameraAnimating) return;
      this.resetSceneDetails(newSceneModel, true, true ,false);
      oldSceneModel.showHide(true);
      return;
    }

    if ( newSceneModelisReady && oldSceneModelisReady ) { console.log("2 ---  newSceneModel.isReady() && oldSceneModelisReady");
      this.toggleSelectedSceneDetails(oldSceneModel, newSceneModel, false);
      this.hideSceneModels(newSceneModel);
      return;
    }

    if ( !newSceneModelisReady && oldSceneModelisReady ) { console.log("3 --- !newSceneModelisReady && oldSceneModelisReady");
      var pos = newSceneModel.getCameraPosition();
      this.swapSelectedModels(oldSceneModel, newSceneModel);
      this.showSceneModels();
      eventController.trigger(eventController.SET_CAMERA_AND_TARGET, pos.camera, pos.target, false, false );
      return;
    }

    if ( !newSceneModelisReady && !oldSceneModel ) { console.log("4 --- !newSceneModelisReady && !oldSceneModel");
      newSceneModel.set({ selected: true });
      this.zoomToSelectedSceneModel(newSceneModel);
      return;
    }

    if ( newSceneModelisReady && !oldSceneModel ) { console.log("5 --- -------END------");
      // this.toggleSelectedSceneDetails(oldSceneModel, newSceneModel, false);
      // this.hideSceneModels(newSceneModel);
      // newSceneModel.setSelectedDelay(true, 1);
      newSceneModel.set({ selected: true });
      this.hideSceneModels(newSceneModel);
      this.resetSceneDetails(newSceneModel, true, false ,false);

      return;
    }

    console.log("6 --- -------END------");
    newSceneModel.set({ selected: true });
    this.zoomToSelectedSceneModel(newSceneModel);
  },
  swapSelectedModels: function (oldSceneModel, newSceneModel) {
    oldSceneModel.setSelectedDelay(false, 500);
    newSceneModel.setSelectedDelay(true, 500);
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
        this.resetSceneDetails(selectedScene, true, false, false);
    }
  },
  resetSceneDetails: function ( sceneModel, moveCamera, animateCamera, trigger ) {
    eventController.trigger(eventController.TOGGLE_AMBIENT_LIGHTING, sceneModel.getAmbientLighting());
    eventController.trigger(eventController.RESET_RAYCASTER, sceneModel.get("sceneDetails").get("interactiveObjects"));
    eventController.trigger(eventController.TOGGLE_SCENE_DETAILS_CONTROLS, sceneModel.get("className"));
    if (moveCamera === true ) {
      var pos = sceneModel.getCameraPosition();
      eventController.trigger(eventController.SET_CAMERA_AND_TARGET,
        pos.camera,
        pos.target,
        animateCamera,
        trigger
      );
    }
  },
  toggleSelectedSceneDetails: function (oldSceneModel, newSceneModel, trigger) {
    var fadeTime = utils.getAnimationSpeed().materialsFade;
    var self = this;

    oldSceneModel.fadeMaterials(0);
    this.swapSelectedModels(oldSceneModel, newSceneModel);

    setTimeout(function () {
      self.resetSceneDetails(newSceneModel, true, false, trigger);
      newSceneModel.fadeMaterials(1);
    }, fadeTime);

  },
  zoomToSelectedSceneModel: function (sceneModel, options) {
    eventController.trigger(eventController.SCENE_MODEL_SELECTED, sceneModel, options);  //zoom to selected model
  },
  hideSceneModels: function (selectedSceneModel) {
    var selectedFalse = this.sceneModelCollection.where({ selected: false });
    _.each(selectedFalse, function (sceneModel) {
      sceneModel.showHide(false);
    }, this);
    selectedSceneModel.hideOutsideDetails();
  },
  showSceneModels: function () {
    this.sceneModelCollection.forEach(function (sceneModel) {
        sceneModel.showHide(true);
    });
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
      this.setHoverSceneModel(this.getNextSceneModel(next), true);
    }

  },
  getNextSceneModel: function (nextOrPrev) {
    var hoverModel = this.sceneModelCollection.findWhere({ hover: true });
    var numFloor = this.sceneModelCollection.where({ interactive: true }).length;
    var newFloorIndex;
    var floorIndex = hoverModel ? hoverModel.get("floorIndex") : null;

    if (hoverModel) return this.sceneModelCollection.findWhere({ floorIndex: numFloor - 1 });

    if ( nextOrPrev ) {
      if ( floorIndex > 0 ) return this.sceneModelCollection.findWhere({ floorIndex: floorIndex - 1});
    } else {
      newFloorIndex = floorIndex < numFloor - 1 ? floorIndex + 1 : 0;
      return this.sceneModelCollection.findWhere({ floorIndex: newFloorIndex});
    }

  },
  sceneModelReady: function (sceneModel) {
    var isCameraAnimating = commandController.request(commandController.IS_CAMERA_ANIMATING);
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, sceneModel.get("sceneDetails").getAllMeshes());

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
    var self = this;
    var isSameModel = selectedSceneModel && (selectedSceneModel.cid === sceneModel.cid);
    var sceneDetails = sceneModel.get("sceneDetails");
    var timeOpenDoors;

    if ( isSameModel ) {
      sceneDetails.showHide(true);
      this.resetSceneDetails(sceneModel, false, false, true);
    }


    setTimeout( function () {
      timeOpenDoors = sceneModel.openDoors(true);
      setTimeout( function () {
        if ( isSameModel ) {
          eventController.once(eventController.CAMERA_FINISHED_ANIMATION, function () {
              self.hideSceneModels(selectedSceneModel);
          });
          self.setCameraTarget(sceneModel, true, true);
          sceneModel.enteringScene();
        }
      }, timeOpenDoors);
    }, 1500);
  },
  setCameraTarget: function (sceneModel, animate, trigger) {
    var pos = sceneModel.getCameraPosition();
    eventController.trigger(eventController.SET_CAMERA_AND_TARGET, pos.camera, pos.target, animate, trigger );
  },
  addListeners: function () {
     // hover/click events from the 3d space
     eventController.on(eventController.MOUSE_CLICK_SELECT_OBJECT_3D, this.clickSelectSceneModel, this);
     eventController.on(eventController.HOVER_NAVIGATION, this.setMouseMoveHoverSceneModel, this);

     // hover/click events from the navigation bar
     eventController.on(eventController.SWITCH_PAGE, this.navigationBarSelectSceneModel, this);
     eventController.on(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR, this.setHoverSceneModelNavBar, this);

     eventController.on(eventController.RESET_SCENE, this.resetScene, this);
     eventController.on(eventController.CLICK_RESET_SCENE_DETAILS, this.clickResetSceneDetails, this);
     eventController.on(eventController.SCENE_DETAILS_SELECT_OBJECT, this.sceneDetailsSelectObject, this);
     eventController.on(eventController.TOGGLE_SELECT_SCENE_MODEL, this.toggleSelect, this);
     eventController.on(eventController.SCENE_MODEL_READY, this.sceneModelReady, this);
  },
  removeListeners: function () {
    eventController.off(eventController.MOUSE_CLICK_SELECT_OBJECT_3D, this.clickSelectSceneModel, this);
    eventController.off(eventController.HOVER_NAVIGATION, this.setMouseMoveHoverSceneModel, this);

    eventController.off(eventController.SWITCH_PAGE, this.navigationBarSelectSceneModel, this);
    eventController.off(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR, this.setHoverSceneModelNavBar, this);

    eventController.off(eventController.RESET_SCENE, this.resetScene, this);
    eventController.off(eventController.CLICK_RESET_SCENE_DETAILS, this.clickResetSceneDetails, this);
    eventController.off(eventController.SCENE_DETAILS_SELECT_OBJECT, this.sceneDetailsSelectObject, this);
    eventController.off(eventController.TOGGLE_SELECT_SCENE_MODEL, this.toggleSelect, this);
    eventController.off(eventController.SCENE_MODEL_READY, this.sceneModelReady, this);
  }
});

module.exports = SceneSelector;
