import eventController from "../../controllers/eventController";
import BaseModel from "../../models/BaseModel";
import TWEEN from "tween.js";
import THREE from "three";
var OrbitControls = require('three-orbit-controls')(THREE);

var CameraControls = BaseModel.extend({
  initialize: function (options) {
    _.bindAll(this, "updateCamera");
    // eventController.on(eventController.CHANGE_CAMERA, this.updateCamera);
    this.camera = options.camera;
    this.addListeners();
    this.setInitialPosition();
    this.cameraControls = new OrbitControls(this.camera, options.canvasEl);
    // this.cameraControls.autoRotate = true;
  },
  addListeners: function () {
    eventController.on(eventController.SCENE_MODEL_SELECTED, this.zoomOnSceneModel, this);
  },
  removeListeners: function () {
    eventController.off(eventController.SCENE_MODEL_SELECTED, this.zoomOnSceneModel, this);
  },
  zoomOnSceneModel: function (object3d) {
    var zSpacer = 5;
    var newPositionZ = object3d.position.z + object3d.geometry.boundingBox.max.z + zSpacer;
    var newPositionY = object3d.position.y;
    var newPosition = { x: object3d.position.x, y: newPositionY, z: newPositionZ };
    console.log("this.cameraControls: ", this.cameraControls);
    this.tweenCameraToPosition(this.cameraControls.object, newPosition);
    // this.cameraControls.target = new THREE.Vector3( 0, newPositionY, newPositionZ );
  },
  getControls: function () {
    return this.cameraControls;
  },
  setInitialPosition: function () {
    this.camera.target = new THREE.Vector3( 0, 6, 0 );
    this.camera.position.set(-10, 6, 20);
  },
  updateCamera: function (index) {
    // var selectedObject = this.sceneObjects[index];
    // var initialPosition = { z: 60, y: 0, x: -15 };

    // this.camera.position = initialPosition;
    // this.camera.lookAt(this.sceneObjects[index].position);
    // this.tweenCameraToPosition(this.camera, { x: 20, y: 2, z: 7.5 });
    // this.tweenToObject({ x: 30, y: 2, z: 7.5  }, this.cameraControls);
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
