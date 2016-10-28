import eventController from "../../controllers/eventController";
import BaseModel from "../../models/BaseModel";
import TWEEN from "tween.js";
import THREE from "three";
import utils from "../../util/utils"
var OrbitControls = require('three-orbit-controls')(THREE);
var CAMERA_INTIAL_POSITION = { x: -25, y: 45, z: 45 };
var TARGET_INITIAL_POSITION = { x: 0, y: 15, z: 0 };

var CameraControls = BaseModel.extend({
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
    if (this.isAnimating()) TWEEN.removeAll();
    var newPositions = sceneModel.getCameraPosition();
    this.tweenToPosition( this.orbitControls.target, newPositions.target );  // move camera target or lookAt
    this.tweenToPosition( this.orbitControls.object.position, newPositions.camera, sceneModel.get("ready") ); // animate move camera
  },
  getControls: function () {
    return this.orbitControls;
  },
  setCameraInitialPosition: function () {
    this.camera.position.set( CAMERA_INTIAL_POSITION.x, CAMERA_INTIAL_POSITION.y, CAMERA_INTIAL_POSITION.z);  // set Initial Camera Position
    this.orbitControls.target = new THREE.Vector3( TARGET_INITIAL_POSITION.x, TARGET_INITIAL_POSITION.y, TARGET_INITIAL_POSITION.z );
  },
  tweenToPosition: function (oldPosition, newPosition, triggerTrue) {
    new TWEEN.Tween(oldPosition).to(newPosition, utils.getAnimationSpeed().cameraMove)
    .easing(TWEEN.Easing.Circular.In)
    .onStart(function () {
      if (triggerTrue) eventController.trigger(eventController.CAMERA_START_ANIMATION);
    })
    .onComplete(function () {
      if (triggerTrue) eventController.trigger(eventController.CAMERA_FINISHED_ANIMATION);
    })
    .start();
  },
  isAnimating: function () {
    return TWEEN.getAll().length > 0;
  },
  render: function () {
    return this;
  }
});
module.exports = CameraControls;
