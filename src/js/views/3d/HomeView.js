import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
import navigationList from "../../data/navigationList";
import SceneModel from "../../models/sceneModel";
import SceneModelCollection from "../../collections/SceneModelCollection";
import utils from "../../util/utils";
import THREE from "three";
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
    eventController.trigger(eventController.LOAD_JSON_MODEL, "models3d/floor.json", {name: SCENE_MODEL_NAME}); //load scene Model
    eventController.trigger(eventController.LOAD_JSON_MODEL, "models3d/ground.json", { name: "ground" }); //load scene Model
  },
  addListeners: function () {
     eventController.on(eventController.MODEL_LOADED, this.modelLoaded, this );
  },
  removeListeners: function () {
    eventController.off(eventController.MODEL_LOADED, this.modelLoaded, this );
  },
  modelLoaded: function (obj) {
    console.log("modelLoaded:", obj);
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
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, [sceneModel]);
  }
});

module.exports = HomeView;
