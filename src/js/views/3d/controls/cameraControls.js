import TWEEN from "tween.js";
import THREE from "three";

import eventController from "../../../controllers/eventController";
import BaseModel from "../../../models/BaseModel";
import utils from "../../../util/utils"
var OrbitControls = require('three-orbit-controls')(THREE);

var CAMERA_INTIAL_POSITION = { x: -25, y: 45, z: 45 };
var TARGET_INITIAL_POSITION = { x: 0, y: 15, z: 0 };

var CameraControls = BaseModel.extend({
  initialize: function (options) {
    this.camera = options.camera;
    this.addListeners();
    this.orbitControls = new OrbitControls(this.camera, options.canvasEl);
    this.setCameraInitialPosition();
    var hello = 5;
  },
  addListeners: function () {
    eventController.on(eventController.SCENE_MODEL_SELECTED, this.zoomOnSceneModel, this);
    eventController.on(eventController.RESET_SCENE, this.setCameraInitialPosition, this);
    eventController.on(eventController.RESET_SCENE_DETAILS, this.setCameraToSceneDetails, this);
    eventController.on(eventController.SET_CAMERA_AND_TARGET, this.setCameraAndTarget, this);
  },
  removeListeners: function () {
    eventController.off(eventController.SCENE_MODEL_SELECTED, this.zoomOnSceneModel, this);
    eventController.off(eventController.RESET_SCENE, this.setCameraInitialPosition, this);
    eventController.off(eventController.RESET_SCENE_DETAILS, this.setCameraSceneDetails, this);
  },
  zoomOnSceneModel: function (sceneModel, options) {
    var newPositions = sceneModel.getCameraPosition();
    var middlePoint = _.clone(newPositions.camera);

    if (options.tween === "cancel") {
      console.log("zoomOnSceneModel-------CANCEL");
      TWEEN.removeAll();
    } else {
      return;
    }

    if (options.pathPoints === 2) {
      middlePoint = _.clone(newPositions.camera);
      middlePoint.x = 0;
      middlePoint.z = this.orbitControls.object.position.z;

      this.tweenMultiPoints( // animate move camera
        this.orbitControls.object.position,
        newPositions.camera,
        middlePoint,
        true
      );
      this.tweenNormal( this.orbitControls.target, newPositions.target);  // move camera target or lookAt
    } 

  },
  zoomOnSceneDetails: function () {

  },
  getControls: function () {
    return this.orbitControls;
  },
  setCameraAndTarget: function (nPos) {
    this.orbitControls.target = new THREE.Vector3( nPos.target.x, nPos.target.y, nPos.target.z );
    this.orbitControls.object.position.set(nPos.camera.x,nPos.camera.y,nPos.camera.z);
  },
  setCameraToSceneDetails: function (sceneModel) {
    var nPos = sceneModel.getCameraPosition();
    this.orbitControls.target = new THREE.Vector3( nPos.target.x, nPos.target.y, nPos.target.z );
    this.orbitControls.object.position.set(nPos.camera.x,nPos.camera.y,nPos.camera.z);
  },
  setCameraInitialPosition: function () {
    this.camera.position.set( CAMERA_INTIAL_POSITION.x, CAMERA_INTIAL_POSITION.y, CAMERA_INTIAL_POSITION.z);  // set Initial Camera Position
    this.orbitControls.target = new THREE.Vector3( TARGET_INITIAL_POSITION.x, TARGET_INITIAL_POSITION.y, TARGET_INITIAL_POSITION.z );
  },
  tweenMultiPoints: function (cameraOrTargetPos, newPosition, middlePoint, trigger) {
    var animationSpeed = utils.getAnimationSpeed().cameraMove;
    var tweenStart = this.getTween(cameraOrTargetPos, middlePoint, 1500, false);
    var tweenFinish = this.getTween(cameraOrTargetPos, newPosition, animationSpeed, trigger);
    tweenStart.chain( tweenFinish );
    tweenStart.start();
  },
  tweenNormal: function (cameraOrTargetPos, newPosition) {
    var animationSpeed = utils.getAnimationSpeed().cameraMove;
    var tween = this.getTween(cameraOrTargetPos, newPosition, animationSpeed, false);
    tween.start();
  },
  getTween: function (startPos, endPos , speed, trigger) {
    var tween = new TWEEN.Tween(startPos)
    .to(endPos, speed)
    // .easing(TWEEN.Easing.Circular.Out)
    // .interpolation(TWEEN.Interpolation.Bezier)
    .onStart( () => {
      if (trigger) eventController.trigger(eventController.CAMERA_START_ANIMATION);
    })
    .onComplete( () => {
      // console.log("onCOmplete", new Date().getTime());
      if (trigger) eventController.trigger(eventController.CAMERA_FINISHED_ANIMATION);
    });
    return tween;
  },
  isAnimating: function () {
    return TWEEN.getAll().length > 0;
  },
  render: function () {
    return this;
  }
});
module.exports = CameraControls;
