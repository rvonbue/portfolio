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
    this.camera.position.set( -10, 8, 20);  // set Initial Camera Position
    this.orbitControls = new OrbitControls(this.camera, options.canvasEl);
    this.orbitControls.target = new THREE.Vector3( 0, 6, 0 );
  },
  addListeners: function () {
    eventController.on(eventController.SCENE_MODEL_SELECTED, this.zoomOnSceneModel, this);
  },
  removeListeners: function () {
    eventController.off(eventController.SCENE_MODEL_SELECTED, this.zoomOnSceneModel, this);
  },
  zoomOnSceneModel: function (object3d) {
    var zSpacer = 5;  // Move camera away from target... so you can see the object
    var newCameraTarget = {
      x: object3d.position.x,
      y: object3d.position.y,
      z: 0
     };

     var newCameraPosition = {
       x: object3d.position.x,
       y: object3d.position.y + ( object3d.geometry.boundingBox.max.y / 2),
       z: object3d.geometry.boundingBox.max.z
    };
    this.tweenToPosition( this.orbitControls.target, newCameraTarget );  // move camera target or lookAt
    this.tweenToPosition( this.orbitControls.object.position, newCameraPosition );
  },
  getControls: function () {
    return this.orbitControls;
  },
  tweenToPosition: function (obj, newPosition) {
    var tween2 = new TWEEN.Tween(obj).to({
        x: newPosition.x,
        y: newPosition.y,
        z: newPosition.z
    }).easing(TWEEN.Easing.Linear.None)
    // .onUpdate(function (a, b) {})
    // .onComplete(function () {})
    .start();
  },
  render: function () {
    return this;
  }
});
module.exports = CameraControls;
