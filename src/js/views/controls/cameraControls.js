import eventController from "../../controllers/eventController";
import BaseModel from "../../models/BaseModel";
import TWEEN from "tween.js";
import THREE from "three";
import utils from "../../util/utils"
var OrbitControls = require('three-orbit-controls')(THREE);
var INTIAL_POSITION = { x: -25, y: 45, z: 45 };
var TARGET_INITIAL_POSITION = { x: 0, y: 15, z: 0 };


var CameraControls = BaseModel.extend({
  animating: false,
  initialize: function (options) {
    this.camera = options.camera;

    this.addListeners();
    this.orbitControls = new OrbitControls(this.camera, options.canvasEl);
    this.setCameraInitialPosition();
  },
  addListeners: function () {
    eventController.on(eventController.SCENE_MODEL_SELECTED, this.zoomOnSceneModel, this);
    eventController.on(eventController.RESET_SCENE, this.setCameraInitialPosition, this);
  },
  removeListeners: function () {
    eventController.off(eventController.SCENE_MODEL_SELECTED, this.zoomOnSceneModel, this);
    eventController.off(eventController.RESET_SCENE, this.setCameraInitialPosition, this);
  },
  zoomOnSceneModel: function (sceneModel) {
    if (this.animating) return;
    this.animating = false;
    var newCameraTargetPosition = sceneModel.getCameraPosition();
    this.tweenToPosition( this.orbitControls.target, newCameraTargetPosition.target );  // move camera target or lookAt
    this.tweenToPosition( this.orbitControls.object.position, newCameraTargetPosition.camera, true ); // animate move camera
  },
  getControls: function () {
    return this.orbitControls;
  },
  setCameraInitialPosition: function () {
    this.camera.position.set( INTIAL_POSITION.x, INTIAL_POSITION.y, INTIAL_POSITION.z);  // set Initial Camera Position
    this.orbitControls.target = new THREE.Vector3( TARGET_INITIAL_POSITION.x, TARGET_INITIAL_POSITION.y, TARGET_INITIAL_POSITION.z );
  },
  tweenToPosition: function (oldPosition, newPosition, triggerTrue) {
    var self = this;
    var tween2 = new TWEEN.Tween(oldPosition).to({
        x: newPosition.x,
        y: newPosition.y,
        z: newPosition.z
    }, utils.getAnimationSpeed().cameraMove)
    .easing(TWEEN.Easing.Circular.In)
    // .onUpdate(function (a, b) {})
    .onComplete(function () {
      self.animating = false;
        if (triggerTrue) eventController.trigger(eventController.CAMERA_FINISHED_ANIMATION );
    })
    .start();
  },
  render: function () {
    return this;
  }
});
module.exports = CameraControls;
