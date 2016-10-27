import eventController from "../../controllers/eventController";
import BaseModel from "../../models/BaseModel";
import SceneLoader from "../3d/SceneLoader";
import MovieTheaterView3d from "../3d/movieTheaterView3d";
import TWEEN from "tween.js";
import THREE from "three";

var SceneControls = BaseModel.extend({
  defaults:  {
    home: null
  },
  initialize: function (options) {
    this.canvasEl = $(options.canvasEl);
    this.camera = options.camera;
    this.raycasterObjects = [];
    this.mouse = new THREE.Vector2();
    this.addListeners(this.canvasEl);
    // this.loadEnvironmentMap();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 100;
    this.raycaster.near = 0.25;
    this.loadInitialScene("home");
    this.animating = false;
  },
  addListeners: function () {
    var self = this;
    // var throttledMouseMove = _.throttle(_.bind(self.onMouseMove, self), 50);
    this.canvasEl.on("mousemove", function (evt) { self.onMouseMove(evt); });
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
  },
  onMouseClick: function (evt) {
    var closestObject = this.shootRaycaster(evt);
    // if ( closestObject ) eventController.trigger(eventController.MOUSE_CLICK_SELECT_OBJECT_3D, closestObject);
  },
  onMouseMove: function (evt) {
    evt.preventDefault();
    eventController.trigger(eventController.HOVER_NAVIGATION, this.shootRaycaster(evt));
  },
  shootRaycaster: function (evt) { //shoots a ray at all the interactive objects
    var navigationBarOffsetY = 45;
    this.mouse.x = ( evt.clientX / this.width ) * 2 - 1;
		this.mouse.y = - ( (evt.clientY - navigationBarOffsetY ) / this.height ) * 2 + 1; 
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
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, [skybox]);
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
