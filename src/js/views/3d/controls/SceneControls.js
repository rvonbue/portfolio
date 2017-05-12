import TWEEN from "tween.js";
import THREE from "three";

import eventController from "../../../controllers/eventController";
import BaseModel from "../../../models/BaseModel";
import utils from "../../../util/utils";

var SceneControls = BaseModel.extend({
  defaults: {
    raycasterObjects: [],
  },
  initialize: function (options) {
    _.bindAll(this, "onMouseClick", "onMouseMove", "onMouseDown");
    this.lastRaycastObjectId = 1325435;
    this.canvasEl = $(options.canvasEl);
    this.camera = options.camera;
    this.raycasterOffset = { x: 1, y: 47 };  //ozzffset of canvas;
    this.mouse = new THREE.Vector2();
    this.addListeners();
    // this.loadEnvironmentMap();
    this.setRaycasterOptions();
    this.addSelectMesh();
  },
  setRaycasterOptions: function () {
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 125;
    this.raycaster.near = 0.25;
  },
  triggerHoverNav: function () {
    eventController.trigger(eventController.HOVER_NAVIGATION, null);
  },
  addSelectMesh: function () {
    var geo = new THREE.OctahedronGeometry(0.25, 0);
    var material = new THREE.MeshBasicMaterial({ color: "#FF0000", wireframe: true });
    this.selectMesh = new THREE.Mesh( geo, material );
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, [this.selectMesh]);
  },
  onResize: function (size) {
    this.height = size.h;
    this.width = size.w;
    var canvasOffsetY = 0; //  this.canvasEl.offset().top);
    this.raycasterOffset = { x: 1, y: canvasOffsetY };
  },
  onMouseDown: function (evt) {
    this.clickStartPos = {x: evt.pageX | evt.clientX, y: evt.pageY | evt.clientY };
  },
  onMouseClick: function (evt) {
    var dragTolerance = 10;
    var x = evt.pageX | evt.clientX;
    var y = evt.pageY | evt.clientY;


    var xDiff = Math.abs(this.clickStartPos.x - x);
    var yDiff = Math.abs(this.clickStartPos.y - y);

    if ( xDiff > dragTolerance || yDiff > dragTolerance) return;

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
      this.updateHoverMouseCursor(raycastIntersect);
      eventController.trigger(eventController.HOVER_NAVIGATION, raycastIntersect);
    }
  },
  updateHoverMouseCursor: function (raycastIntersect) {
    var hoveredBool = raycastIntersect ? true : false;
    this.canvasEl.toggleClass("hovered-3d", hoveredBool);
  },
  shootRaycaster: function (evt) { //shoots a ray at all the interactive objects
    this.mouse.x = ( (evt.clientX - this.raycasterOffset.x) / this.width ) * 2 - 1;
		this.mouse.y = - ( (evt.clientY - this.raycasterOffset.y ) / this.height ) * 2 + 1;
    this.raycaster.setFromCamera( this.mouse, this.camera );
    return this.findClosestObject(this.raycaster.intersectObjects( this.get("raycasterObjects") ));
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
  loadEnvironmentMap: function (reflectionCube) {
    var size = 500;
  	var materialArray = this.getMaterialArray();

  	var skyBox = new THREE.Mesh(
      new THREE.CubeGeometry( size, size, size ),
      new THREE.MeshFaceMaterial( materialArray )
    );
    // scene.background = skyBox;
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, [skyBox]);
  },
  getUrls: function () {
    var format = '.jpg';
    var path = "textures/cubeMap/aboveClouds/";

    return [
      path + 'posx' + format, path + 'negx' + format,
      path + 'posy' + format, path + 'negy' + format,
      path + 'posz' + format, path + 'negz' + format
    ];
  },
  getMaterialArray: function () {
    var urls = this.getUrls();
  	var materialArray = [];

  	for (var i = 0; i < 6; i++)
  		materialArray.push( new THREE.MeshBasicMaterial({
  			map: new THREE.TextureLoader().load( urls[i] ),
  			side: THREE.BackSide
		  })
    );

    return materialArray;
  },
  resetRaycaster: function (arr) {
    this.set("raycasterObjects", arr);
  },
  cancelSelectMeshTimer: function () {

    if (this.selectMeshTimer) {
      clearTimeout(this.selectMeshTimer);
      this.selectMeshTimer = null;
    }

  },
  getMeshCenter: function (selectedMesh) {
    var center = selectedMesh.geometry.boundingSphere.center;

    console.log("center", center);
    return {
      x: selectedMesh.position.x + center.x,
      y: selectedMesh.position.y + center.y,
      z: selectedMesh.position.z + center.z + 0.5 // TODO: magic number should be move along angle to camera
    };
  },
  moveSceneDetailsIcon: function (selectedMesh) {
    this.cancelSelectMeshTimer();

    if (!selectedMesh) {
      var self = this;
      this.selectMeshTimer = setTimeout( function () {
        self.selectMesh.visible = false;
      }, 1000);
      return;
    }
    this.selectMesh.visible = true;

    var tweenMove = new TWEEN.Tween(this.selectMesh.position)
    .to(this.getMeshCenter(selectedMesh), 500)
    .easing(TWEEN.Easing.Exponential.Out)
    .start();

    var tweenRotate = new TWEEN.Tween(this.selectMesh.rotation)
    .to({x: "+6.28319", y: "+6.28319", z: "+6.28319" }, 750)  //6.28319 = 260 degrees
    .easing(TWEEN.Easing.Exponential.In)
    // .delay(250)
    .start();

  },
  addListeners: function () {
    this.throttledMouseMove = _.throttle(this.onMouseMove, 25);
    this.canvasEl.on("mousemove", this.throttledMouseMove);
    this.canvasEl.on("mouseleave", this.triggerHoverNav);
    this.canvasEl.on("mouseup", this.onMouseClick);
    this.canvasEl.on("mousedown", this.onMouseDown);


    eventController.on(eventController.ON_RESIZE, this.onResize, this);
    eventController.on(eventController.RESET_RAYCASTER, this.resetRaycaster, this);
    eventController.on(eventController.MOVE_SCENE_SELECTOR, this.moveSceneDetailsIcon, this);
  },
  removeListeners: function () {
    this.canvasEl.off("mousemove", this.throttledMouseMove);
    this.canvasEl.off("mouseleave", this.triggerHoverNav);
    this.canvasEl.off("mouseup",this.onMouseClick);
    this.canvasEl.off("mousedown", this.onMouseDown);

    eventController.off(eventController.ON_RESIZE, this.onResize, this);
    eventController.off(eventController.RESET_RAYCASTER, this.resetRaycaster, this);
    eventController.off(eventController.MOVE_SCENE_SELECTOR, this.moveSceneDetailsIcon, this);
  },
  render: function () {
    return this;
  }
});
module.exports = SceneControls;
