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
  },
  removeListeners: function () {
    eventController.off(eventController.SCENE_MODEL_SELECTED, this.zoomOnSceneModel, this);
    eventController.off(eventController.RESET_SCENE, this.setCameraInitialPosition, this);
    eventController.off(eventController.RESET_SCENE_DETAILS, this.setCameraSceneDetails, this);
  },
  zoomOnSceneModel: function (sceneModel) {
    console.log("zoomOnSceneModel-------CANCEL");
    // if ( this.isAnimating() ) return;
    console.log("zoomOnSceneModel");
    TWEEN.removeAll();
    var newPositions = sceneModel.getCameraPosition();
    this.tweenToPosition( this.orbitControls.target, newPositions.target );  // move camera target or lookAt
    this.tweenToPosition( this.orbitControls.object.position, newPositions.camera, !sceneModel.isReady() ); // animate move camera
  },
  tryAgain: function () {

  },
  getControls: function () {
    return this.orbitControls;
  },
  setCameraToSceneDetails: function (sceneModel) {
    if (!sceneModel) return;
    // this.zoomOnSceneModel(sceneModel); // if you want this animated;
    var nPos = sceneModel.getCameraPosition();
    this.orbitControls.target = new THREE.Vector3( nPos.target.x, nPos.target.y, nPos.target.z );
    this.orbitControls.object.position.set(nPos.camera.x,nPos.camera.y,nPos.camera.z);
  },
  setCameraInitialPosition: function () {
    this.camera.position.set( CAMERA_INTIAL_POSITION.x, CAMERA_INTIAL_POSITION.y, CAMERA_INTIAL_POSITION.z);  // set Initial Camera Position
    this.orbitControls.target = new THREE.Vector3( TARGET_INITIAL_POSITION.x, TARGET_INITIAL_POSITION.y, TARGET_INITIAL_POSITION.z );
  },
  tweenToPosition: function (cameraOrTargetPos, newPosition, isCamera) {
    var animationSpeed = utils.getAnimationSpeed().cameraMove;
    var middlePoint = _.clone(newPosition);
    middlePoint.x = 0;
    middlePoint.z = cameraOrTargetPos.z;


    // if ( isCamera === true) {
    //   var tweenStart = this.getTween(cameraOrTargetPos, middlePoint, 1000, !isCamera);
    //   var tweenFinish = this.getTween(cameraOrTargetPos, newPosition, animationSpeed, isCamera);
    //   tweenStart.chain( tweenFinish );
    //   tweenStart.start();
    // } else {
      var tweenStart = this.getTween(cameraOrTargetPos, newPosition, animationSpeed, isCamera);
      tweenStart.start();
    // }
  },
  getTween: function (startPos, endPos , speed, isCamera) {
    console.log("TWEEN")
    var tween = new TWEEN.Tween(startPos)
    .to(endPos, speed)
    .easing(TWEEN.Easing.Circular.Out)
    // .interpolation(TWEEN.Interpolation.CatmullRom)
    .onStart( () => {
      // if (isCamera) eventController.trigger(eventController.CAMERA_START_ANIMATION);
    })
    .onComplete( () => {
      console.log("onCOmplete", new Date().getTime());
      if (isCamera) eventController.trigger(eventController.CAMERA_FINISHED_ANIMATION);
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
