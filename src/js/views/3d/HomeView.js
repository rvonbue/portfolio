import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
import navigationList from "../../data/navigationList";
import SceneModel from "../../models/sceneModel";
import SceneModelCollection from "../../collections/SceneModelCollection";
import utils from "../../util/utils";
import THREE from "three";
import data from "../../data/roboto_regular.json";

var HomeView = BaseView.extend({
  name: null,
  ready: true,
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    window.SceneModelCollection = this.SceneModelCollection = new SceneModelCollection();
    eventController.once(eventController.MODEL_LOADED, this.sceneModelLoaded, this );
    eventController.trigger(eventController.LOAD_JSON_MODEL, "models3d/floor.json", {name: "floor"}); //load scene Model
    this.addListeners();
  },
  addListeners: function () {
    // eventController.on(eventController.HOVER_NAVIGATION, this.selectFloor, this);
  },
  removeListeners: function () {

  },
  sceneModelLoaded: function (obj) {
    var object3d = obj.object3d;
    this.loadFloors(object3d);
    this.SceneModelCollection.each(function (scmodel, i) {
      var object3d = scmodel.get("object3d");
      var floorHeight =  Math.abs(object3d.geometry.boundingBox.max.y) + Math.abs(object3d.geometry.boundingBox.min.y);
      object3d.position.set(0, i*floorHeight, 0);
    });
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, this.SceneModelCollection.models);
  },
  loadFloors: function (object3d) {
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
      console.log("selectFloor", hello);
    } else if (this.selectedFloor) {
      this.selectedFloor.set("selected", false);
      this.selectedFloor = null;
    }
  },
  addText: function (sceneModel) {
    var text3d = this.getText3d(sceneModel.get("name"));
    var object3d = sceneModel.get("object3d");
    text3d.position.z = object3d.geometry.boundingBox.max.z - text3d.geometry.boundingBox.max.z;
    text3d.position.y = -text3d.geometry.boundingBox.max.y / 2;
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
  }
});

module.exports = HomeView;
