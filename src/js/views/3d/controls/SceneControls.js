import TWEEN from "tween.js";
import THREE from "three";

import eventController from "../../../controllers/eventController";
import BaseModel from "../../../models/BaseModel";
import SceneLoader from "../SceneLoader";

var SceneControls = BaseModel.extend({
  defaults:  {
    home: null
  },
  initialize: function (options) {
    this.lastRaycastObjectId = 1325435;
    this.canvasEl = $(options.canvasEl);
    this.camera = options.camera;
    this.raycasterObjects = [];
    this.raycasterOffset = { x: 1, y: 47 };  //ozzffset of canvas;
    this.mouse = new THREE.Vector2();
    this.addListeners();
    // this.loadEnvironmentMap();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 125;
    this.raycaster.near = 0.25;
    this.loadInitialScene("home");
  },
  addListeners: function () {
    var self = this;
    var throttledMouseMove = _.throttle(_.bind(self.onMouseMove, self), 25);
    this.canvasEl.on("mousemove", function (evt) { throttledMouseMove(evt); });
    this.canvasEl.on("mouseleave", function (evt) { eventController.trigger(eventController.HOVER_NAVIGATION, null) });
    this.canvasEl.on("mouseup", function (evt) { self.onMouseClick(evt); });
    eventController.on(eventController.ON_RESIZE, this.onResize, this);
    eventController.on(eventController.RESET_RAYCASTER, this.resetRaycaster, this);
  },
  removeListeners: function () {
    this.canvasEl.off("mousemove", function (evt) { self.onMouseMove(evt); });
    this.canvasEl.off("mouseleave", function (evt) { eventController.trigger(eventController.HOVER_NAVIGATION, null) });
    this.canvasEl.off("mouseup", function (evt) { self.onMouseClick(evt); });
    eventController.off(eventController.ON_RESIZE, this.onResize, this);
    eventController.off(eventController.RESET_RAYCASTER, this.resetRaycaster, this);
  },
  onResize: function (size) {
    this.height = size.h;
    this.width = size.w;
    this.raycasterOffset = { x: 1, y: this.canvasEl.offset().top };
  },
  onMouseClick: function (evt) {
    var closestObject = this.shootRaycaster(evt);
    if ( closestObject ) eventController.trigger(eventController.MOUSE_CLICK_SELECT_OBJECT_3D, closestObject);
  },
  onMouseMove: function (evt) {
    evt.preventDefault();
    var raycastIntersect = this.shootRaycaster(evt);

    if ((raycastIntersect && this.lastRaycastObjectId === raycastIntersect.object.id)  // if nothing intersected
      || this.lastRaycastObjectId === 0 && !raycastIntersect ) {      // if intersected object is the same
      return;
    } else {
      this.lastRaycastObjectId = raycastIntersect ? raycastIntersect.object.id : 0;
      eventController.trigger(eventController.HOVER_NAVIGATION, raycastIntersect);
    }
  },
  shootRaycaster: function (evt) { //shoots a ray at all the interactive objects
    this.mouse.x = ( (evt.clientX - this.raycasterOffset.x) / this.width ) * 2 - 1;
		this.mouse.y = - ( (evt.clientY - this.raycasterOffset.y ) / this.height ) * 2 + 1;
    this.raycaster.setFromCamera( this.mouse, this.camera );
    return this.findClosestObject(this.raycaster.intersectObjects( this.raycasterObjects ));
  },
  findClosestObject: function (intersects) {
    var closestObject = null;
    _.each(intersects, function (inter, i ) {
      if (i === 0) {
        closestObject = inter;
      } else if (inter.distance < closestObject.distance){
        closestObject = inter;
      }
    });
    return closestObject;
  },
  loadInitialScene: function (name) {
    this.set(name, new SceneLoader({ name: name }));
  },
  loadEnvironmentMap: function (reflectionCube) {
    var format = '.jpg';
    var path = "textures/forbiddenCity/";
    var size = 65;
    var urls = [
        path + 'posx' + format, path + 'negx' + format,
        path + 'posy' + format, path + 'negy' + format,
        path + 'posz' + format, path + 'negz' + format
      ];
    var skyGeometry = new THREE.CubeGeometry( size, size, size );
  	var materialArray = [];
  	for (var i = 0; i < 6; i++)
  		materialArray.push( new THREE.MeshBasicMaterial({
  			map: THREE.ImageUtils.loadTexture( urls[i] ),
  			side: THREE.BackSide
  		}));
  	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
  	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    skyBox.position.y = size / 2;
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, [skyBox]);
  },
  resetRaycaster: function (arr) {
    this.raycasterObjects = arr;
  },
  getCurrentScene: function (name) {
    return this.SceneModelCollection.findWhere({selected: true });
  },
  render: function () {
    return this;
  }
});
module.exports = SceneControls;
