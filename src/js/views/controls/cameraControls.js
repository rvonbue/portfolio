import eventController from "../../controllers/eventController";
import BaseModel from "../../models/BaseModel";
import TWEEN from "tween.js";
import THREE from "three";
import TrackballControls from 'three-trackballcontrols';
// require('three-first-person-controls')(THREE);

var CameraControls = BaseModel.extend({
  initialize: function (options) {
    _.bindAll(this, "updateCamera");
    // eventController.on(eventController.CHANGE_CAMERA, this.updateCamera);
    this.camera = options.camera;
    // this.controls = new THREE.FirstPersonControls(this.camera, undefined, {
    //   lookSpeed: 1,
    //   moveLeft: true,
    //   moveLeft: true,
    //   activeLook: false,
    //   movementSpeed: 35,
    //   enabled: false,
    //   lookVertical: false
    // });
    this.addListeners();
    this.controls = new TrackballControls(this.camera, options.canvasEl);
    this.controls.target = new THREE.Vector3( 0, 6, 0 );
    this.setInitialPosition();
    // console.log("init CameraControls", this.camera);
    // eventController.trigger(eventController.ADD_DAT_GUI_CONTROLLER,{ arr: [this.camera], key: "position", name:"camtarget" });
  },
  addListeners: function () {
    eventController.on(eventController.SCENE_MODEL_SELECTED, this.zoomOnSceneModel, this);
  },
  removeListeners: function () {
    eventController.off(eventController.SCENE_MODEL_SELECTED, this.zoomOnSceneModel, this);
  },
  zoomOnSceneModel: function (object3d) {
    console.log("this.controls", this.controls.object);
    var zSpacer = 5;
    var newPositionZ = object3d.position.z + object3d.geometry.boundingBox.max.z + zSpacer;
    var newPositionY = object3d.position.y;
    var newPosition = { x: object3d.position.x, y: newPositionY, z: newPositionZ }
    // this.tweenCameraToPosition(this.controls.object, newPosition);
    // this.controls.target = new THREE.Vector3( 0, newPositionY, newPositionZ );
  },
  getControls: function () {
    return this.controls;
  },
  setInitialPosition: function () {
    this.camera.position.set(-10, 6, 20);
  },
  updateCamera: function (index) {
    // var selectedObject = this.sceneObjects[index];
    // var initialPosition = { z: 60, y: 0, x: -15 };

    // this.camera.position = initialPosition;
    // this.camera.lookAt(this.sceneObjects[index].position);
    // this.tweenCameraToPosition(this.camera, { x: 20, y: 2, z: 7.5 });
    // this.tweenToObject({ x: 30, y: 2, z: 7.5  }, this.controls);
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
