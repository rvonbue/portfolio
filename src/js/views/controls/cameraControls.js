import eventController from "../../controllers/eventController";
import BaseModel from "../../models/BaseModel";
import TWEEN from "tween.js";
import THREE from "three";
var OrbitControls = require('three-orbit-controls')(THREE);

var CameraControls = BaseModel.extend({
  initialize: function (options) {
    // eventController.on(eventController.CHANGE_CAMERA, this.updateCamera);
    this.camera = options.camera;
    this.addListeners();
    this.setInitialPosition();
    this.orbitControls = new OrbitControls(this.camera, options.canvasEl);
    this.orbitControls.target = new THREE.Vector3( 0, 6, 0 );
      console.log("this.camera: ", this.camera);
  },
  addListeners: function () {
    eventController.on(eventController.SCENE_MODEL_SELECTED, this.zoomOnSceneModel, this);
  },
  removeListeners: function () {
    eventController.off(eventController.SCENE_MODEL_SELECTED, this.zoomOnSceneModel, this);
  },
  zoomOnSceneModel: function (object3d) {
    var zSpacer = 5;
    var newPosition = {
      x: object3d.position.x,
      y: object3d.position.y,
      z: object3d.position.z + object3d.geometry.boundingBox.max.z
     };

    this.tweenToObject(newPosition, this.orbitControls);
    newPosition.z += zSpacer;  // Move camera away from target... so you can see the object
    this.tweenCameraToPosition(this.orbitControls.object, newPosition);
  },
  getControls: function () {
    return this.orbitControls;
  },
  setInitialPosition: function () {
    // this.camera.target = new THREE.Vector3( 0, 6, 0 );
    this.camera.position.set(-10, 8, 20);
  },
  tweenToObject: function (newPosition, controls) {
    var tween2 = new TWEEN.Tween(controls.target).to({
        x: newPosition.x,
        y: newPosition.y,
        z: newPosition.z
    }).easing(TWEEN.Easing.Linear.None).onUpdate(function (a, b) {
    }).onComplete(function () {
    }).start();
  },
  tweenCameraToPosition: function (camera, newPosition) {
    var tween = new TWEEN.Tween(camera.position).to({
        x: newPosition.x,
        y: newPosition.y,
        z: newPosition.z
    }).easing(TWEEN.Easing.Linear.None).onUpdate(function () {
        // camera.lookAt(camera.target);
    }).onComplete(function () {
        // camera.lookAt(selectedObject.position);
    }).start();
  },
  render: function () {
    return this;
  }
});
module.exports = CameraControls;
