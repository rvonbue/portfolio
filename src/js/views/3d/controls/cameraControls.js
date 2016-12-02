import TWEEN from "tween.js";
import THREE from "three";

import eventController from "../../../controllers/eventController";
import commandController from "../../../controllers/commandController";
import BaseModel from "../../../models/BaseModel";
import utils from "../../../util/utils"
var OrbitControls = require('three-orbit-controls')(THREE);

var CAMERA_INTIAL_POSITION = { x: -5, y: 33, z: 45 };
var TARGET_INITIAL_POSITION = { x: 0, y: 20, z:-10 };

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
    eventController.on(eventController.RESET_SCENE_DETAILS, this.setCameraToSceneDetails, this);
    eventController.on(eventController.SET_CAMERA_AND_TARGET, this.setCameraAndTarget, this);

    commandController.reply(commandController.IS_CAMERA_ANIMATING, this.isAnimating, this)
  },
  removeListeners: function () {
    eventController.off(eventController.SCENE_MODEL_SELECTED, this.zoomOnSceneModel, this);
    eventController.off(eventController.RESET_SCENE, this.setCameraInitialPosition, this);
    eventController.off(eventController.RESET_SCENE_DETAILS, this.setCameraToSceneDetails, this);
    eventController.off(eventController.SET_CAMERA_AND_TARGET, this.setCameraAndTarget, this);

    commandController.stopReplying(commandController.IS_CAMERA_ANIMATING, this.isAnimating, this)
  },
  zoomOnSceneModel: function (sceneModel, options) {
    // TWEEN.removeAll();

    var newPositions = sceneModel.getCameraPosition();
    var middlePoint = this.getCameraMiddlePoint(newPositions.camera);

    if (options.pathPoints === 2) {

      this.tweenNormal( this.orbitControls.target, newPositions.target, false);  // move camera target or lookAt
      this.tweenMultiPoints( // animate move camera
        this.orbitControls.object.position,
        newPositions.camera,
        middlePoint,
        true
      );
    } else {
      this.tweenNormal( this.orbitControls.target, newPositions.target, false);
      this.tweenNormal( this.orbitControls.object.position, newPositions.camera, false);
    }
  },
  getCameraMiddlePoint: function (cameraPos) {
     var middlePoint = _.clone(cameraPos);
         middlePoint.x = 0;
         middlePoint.z = this.orbitControls.object.position.z;
     return middlePoint;
  },
  getControls: function () {
    return this.orbitControls;
  },
  setCameraAndTarget: function (cameraPos, targetPos, animate, trigger) {
    TWEEN.removeAll();
    var camera = this.orbitControls.object;
    var target = this.orbitControls;

    if (!animate) {
      if ( cameraPos ) camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
      if ( targetPos ) this.orbitControls.target = new THREE.Vector3( targetPos.x, targetPos.y, targetPos.z );
    } else {
      if ( cameraPos ) this.tweenNormal( camera.position, cameraPos, trigger);
      if ( targetPos ) this.tweenNormal( this.orbitControls.target, targetPos, trigger);
    }
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
    var tweenStart = this.getTween(cameraOrTargetPos, middlePoint, animationSpeed, false);
    var tweenFinish = this.getTween(cameraOrTargetPos, newPosition, animationSpeed, trigger);
    tweenStart.chain( tweenFinish );
    tweenStart.start();
  },
  tweenNormal: function (cameraOrTargetPos, newPosition, trigger) {
    var animationSpeed = utils.getAnimationSpeed().cameraMove;
    var tween = this.getTween(cameraOrTargetPos, newPosition, animationSpeed, trigger);
    tween.start();
  },
  getTween: function (startPos, endPos, speed, trigger) {
    var self = this;
    var tween = new TWEEN.Tween(startPos)
    .to(endPos, speed)
    .easing(TWEEN.Easing.Quartic.Out)
    .interpolation(TWEEN.Interpolation.Bezier)
    .onStart( () => {
      self.animating = true;
      console.log("trigger", trigger);
      if (trigger) eventController.trigger(eventController.CAMERA_START_ANIMATION);
    })
    .onComplete( () => {
      // console.log("onCOmplete", new Date().getTime());
      self.animating = false;
      console.log("trigger", trigger);
      if (trigger) eventController.trigger(eventController.CAMERA_FINISHED_ANIMATION);
    });
    return tween;
  },
  isAnimating: function () {
    return this.animating;
  },
  render: function () {
    return this;
  }
});
module.exports = CameraControls;
