import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
import navigationList from "../../data/navigationList";
import SceneModel from "../../models/sceneModel";
import SceneModelCollection from "../../collections/SceneModelCollection";
import utils from "../../util/utils";
import THREE from "three";
import TWEEN from "tween.js";
import data from "../../data/roboto_regular.json";

var SCENE_MODEL_NAME = "floor";

var HomeView = BaseView.extend({
  name: null,
  ready: false,
  SCENE_MODEL_NAME: SCENE_MODEL_NAME,
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    this.SceneModelCollection = new SceneModelCollection();
    this.addListeners();
    var models = [
      // { url: "models3d/floor.json", name: SCENE_MODEL_NAME},
      { url: "models3d/japanBottomFloor.json", name: "ground" },
      { url: "models3d/roof.json", name: "roof" }
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
  },
  removeListeners: function () {
    eventController.off(eventController.MODEL_LOADED, this.modelLoaded, this );
    eventController.off(eventController.MOUSE_CLICK_SELECT_OBJECT_3D, this.clickSelectSceneModel, this);
    eventController.off(eventController.SWITCH_PAGE, this.navigationBarSelectSceneModel, this);
  },
  clickSelectSceneModel: function (intersectObject) {
    if ( intersectObject ) var name = intersectObject.object.name;
    this.toggleSelectedSceneModel(name);
  },
  navigationBarSelectSceneModel: function (index) {
    if (isNaN(index)) return;
    this.toggleSelectedSceneModel(navigationList[index]);
  },
  toggleSelectedSceneModel: function (sceneModelName) {
    var oldSceneModel = this.SceneModelCollection.findWhere({ selected: true});
    if ( oldSceneModel ) oldSceneModel.set("selected", false);
    var newSceneModel = this.SceneModelCollection.findWhere({ name: sceneModelName }).set({ selected: true });
    if ( newSceneModel ) {
      eventController.trigger(eventController.SCENE_MODEL_SELECTED, newSceneModel.get("object3d"));  //zoom to selected model
      eventController.trigger(eventController.RESET_RAYCASTER, []);
      // this.hideEverythingNotSelected();
    }
  },
  hideEverythingNotSelected: function () {
    var falseArr = this.SceneModelCollection.where({ selected: false });
    _.each(falseArr, function (sceneModel) {
      sceneModel.get("object3d").visible = false;
    });
  },
  getTweenOpacity: function (material, opacityEnd) {
    if ( opacityEnd === 0 )  material.transparent = true;

    var tween = new TWEEN.Tween(material)
    .to({ opacity: opacityEnd }, 500)
    .onComplete(function () {
      if ( opacityEnd === 1 ) {
        material.transparent = false;
      }
    })
    .start();
  },
  modelLoaded: function (obj) {
    if (obj.name === SCENE_MODEL_NAME) {
      this.sceneModelLoaded(obj);
      return;
    }
    this.addNonInteractive(obj);
  },
  setInteractiveObjects: function () {
    var objects3d = this.SceneModelCollection.where({interactive: true}).map(function (model) {
      return model.get('object3d');
    });
    eventController.trigger(eventController.INTERACTIVE_OBJECTS_READY, objects3d);
  },
  sceneModelLoaded: function (obj) {
    var object3d = obj.object3d;
    this.createFloors(object3d);
    var sceneModels = this.SceneModelCollection.where({ interactive: true });
    sceneModels.forEach(function (scmodel, i) { // stack floors on top of each other
      var object3d = scmodel.get("object3d");
      var floorHeight =  Math.abs(object3d.geometry.boundingBox.max.y) + Math.abs(object3d.geometry.boundingBox.min.y);
      object3d.position.set(0, i * floorHeight, 0);
    });
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, sceneModels);
    this.setInteractiveObjects();
  },
  createFloors: function (object3d) {
    _.each(navigationList.reverse(), function (floorName) {
      var sceneModel = new SceneModel({ name: floorName, object3d: object3d.clone() });
      this.addText(sceneModel);
      this.SceneModelCollection.add(sceneModel);
    }, this);
    navigationList.reverse();
  },
  selectFloor: function (closestObject) {
    if (closestObject) {
      this.selectedFloor = this.SceneModelCollection.findWhere({name: closestObject.object.name});
      this.selectedFloor.set("selected", true);
    } else if (this.selectedFloor) {
      this.selectedFloor.set("selected", false);
      this.selectedFloor = null;
    }
  },
  positionRoof: function (object3d) {
    object3d.position.y = navigationList.length * 2.059;  // TODO: magic number
  },
  addText: function (sceneModel) {
    var text3d = this.getText3d(sceneModel.get("name"));
    var object3d = sceneModel.get("object3d");
    var offsetY = 0.25;
    text3d.position.z = object3d.geometry.boundingBox.max.z - text3d.geometry.boundingBox.max.z;
    text3d.position.y = (text3d.geometry.boundingBox.max.y + text3d.geometry.boundingBox.min.y) / 2 - offsetY;
    text3d.position.x = -((text3d.geometry.boundingBox.max.x - text3d.geometry.boundingBox.min.x) / 2);
    object3d.add(text3d);
  },
  getText3d: function (text) {
    var material = new THREE.MeshStandardMaterial({ color: utils.getFontColor().text });

    var	textGeo = new THREE.TextGeometry( text, {
      font: new THREE.Font(data),
      height: 0.5,
      size: 1.5,
      curveSegments: 4,
      bevelThickness: 2,
      bevelSize: 1.5,
      bevelSegments: 3
    });
    textGeo.computeBoundingBox();
    return new THREE.Mesh( textGeo, material );
  },
  addNonInteractive: function (obj) {
    obj.interactive = false;
    var sceneModel = this.SceneModelCollection.add(obj); //adding to collection returns sceneModel
    if (obj.name === "roof") this.positionRoof(sceneModel.get("object3d"));
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, [sceneModel]);
  }
});

module.exports = HomeView;
