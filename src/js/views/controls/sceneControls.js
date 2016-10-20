import eventController from "../../controllers/eventController";
import BaseModel from "../../models/BaseModel";
import ModelLoader from "../../models/modelLoader";
import ArtGalleryView3d from "../3d/artGalleryView3d";
import HomeView from "../3d/HomeView";
import MovieTheaterView3d from "../3d/movieTheaterView3d";
import TWEEN from "tween.js";
import THREE from "three";

var SceneControls = BaseModel.extend({
  defaults:  {
    home: null
  },
  initialize: function (options) {
    this.parentEl = options.parentEl;
    this.canvasEl = $(options.canvasEl);
    this.scene = options.scene;
    this.camera = options.camera;
    this.raycasterObjects = [];
    this.mouse = new THREE.Vector2();
    this.onResize();
    this.addListeners(this.parentEl);
    // this.loadEnvironmentMap();
    this.modelLoader = new ModelLoader();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 100;
    this.loadInitialScene("home");
    this.animating = false;
  },
  addListeners: function (el) {
    var self = this;
    var throttledMouseMove = _.throttle(_.bind(this.onMouseMove, this), 50);
    el.on("mousemove", this.parentEl, function (evt) { throttledMouseMove(evt); });
    el.on("mouseleave", this.parentEl, function (evt) { eventController.trigger(eventController.HOVER_NAVIGATION, null) });
    el.on("mouseup", this.parentEl, function (evt) { self.onMouseClick(evt); });
    eventController.on(eventController.INTERACTIVE_OBJECTS_READY, this.setInteractiveObjects, this);
    eventController.on(eventController.ON_RESIZE, this.onResize, this);
    eventController.on(eventController.RESET_RAYCASTER, this.resetRaycaster, this);

  },
  removeListeners: function () {
    el.off("mousemove", this.parentEl, function (evt) { self.onMouseMove(evt); });
    el.off("mouseleave", this.parentEl, function (evt) { eventController.trigger(eventController.HOVER_NAVIGATION, null) });
    el.off("mouseup", this.parentEl, function (evt) { self.onMouseClick(evt); });
    eventController.off(eventController.INTERACTIVE_OBJECTS_READY, this.setInteractiveObjects, this);
    eventController.off(eventController.ON_RESIZE, this.onResize, this);
    eventController.off(eventController.RESET_RAYCASTER, this.resetRaycaster, this);
  },
  onResize: function (size) {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  },
  onMouseClick: function (evt) {
    var closestObject = this.shootRaycaster(evt);
    if ( closestObject ) eventController.trigger(eventController.MOUSE_CLICK_SELECT_OBJECT_3D, closestObject);
  },
  onMouseMove: function (evt) {
    evt.preventDefault();
    var closestObject = this.shootRaycaster(evt);
    if (closestObject) eventController.trigger(eventController.HOVER_NAVIGATION, closestObject);
  },
  shootRaycaster: function (evt) { //shoots a ray at all the interactive objects
    this.mouse.x = ( evt.clientX / this.width ) * 2 - 1;
		this.mouse.y = - ( evt.clientY / this.height ) * 2 + 1;
    this.raycaster.setFromCamera( this.mouse, this.camera );
    // console.log("mouse:", this.mouse);
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
    this.set(name, new HomeView({ name: name }));
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
  	this.scene.add( skyBox );
  },
  setInteractiveObjects: function (arr) {
    this.raycasterObjects = arr;
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
