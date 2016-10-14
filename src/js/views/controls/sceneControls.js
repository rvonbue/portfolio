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
    el.on("mousemove", this.parentEl, function (evt) { self.onMouseMove(evt); });
    el.on("mouseleave", this.parentEl, function (evt) { eventController.trigger(eventController.HOVER_NAVIGATION, null) });
    el.on("click", this.parentEl, function (evt) { self.onMouseClick(evt); });
    eventController.on(eventController.INTERACTIVE_OBJECTS_READY, this.setInteractiveObjects, this);
    eventController.on(eventController.ON_RESIZE, this.onResize, this);

  },
  removeListeners: function () {
    el.off("mousemove", this.parentEl, function (evt) { self.onMouseMove(evt); });
    el.off("mouseleave", this.parentEl, function (evt) { eventController.trigger(eventController.HOVER_NAVIGATION, null) });
    el.off("click", this.parentEl, function (evt) { self.onMouseClick(evt); });
    eventController.off(eventController.INTERACTIVE_OBJECTS_READY, this.setInteractiveObjects, this);
    eventController.off(eventController.ON_RESIZE, this.onResize, this);
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
    eventController.trigger(eventController.HOVER_NAVIGATION, closestObject);
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

  switchScene: function (name) {
    // console.log("switchScene: name ---",  name);
    // if (this.animating) return false;
    // if( name === "artGallery") {
    //   this.openArtGallery();
    //   return false;
    // }
    // var sceneModel = this.SceneModelCollection.findWhere({name: name });
    // if ( sceneModel ) {  //  if scene exists animate else load new scene
    //   // animate scene
    //   if (sceneModel.get("selected")) return false;
    //   if (  this.SceneModelCollection.length === 1 )  {
    //     sceneModel.set("selected", true);
    //     sceneModel.get("object3d").visible = true;
    //   } else {
    //     this.animateSceneTransition(sceneModel);
    //   }
    // } else {
    //   // load Model
    //   eventController.trigger(eventController.LOAD_NEW_SCENE, "models/" + name +".json", {name: name});
    // }
  },
  modelLoaded: function (obj) {
    // if (obj.name === "artGallery") {
    //   var sceneModel = this.SceneModelCollection.add(obj);
    //   sceneModel.get("object3d").visible = false;
    // } else {
    //   var sceneModel = this.SceneModelCollection.add(obj);
    //   sceneModel.get("object3d").visible = false;
    //   eventController.trigger(eventController.ADD_MODEL_TO_SCENE, sceneModel);
    //   this.switchScene(sceneModel.get("name"));
    // }
  },
  animateSceneTransition: function (sceneModel) {
    // this.animating = true;
    // var object3d = sceneModel.get("object3d");
    // var currentSceneModel = this.getCurrentScene();
    // this.setMeshInitRotation(object3d);
    // object3d.visible = true;
    // sceneModel.set("selected", true);
    //
    // currentSceneModel.set("selected", false);
    // this.hideScene(currentSceneModel.get("object3d"));
    // this.showScene(sceneModel.get("object3d"));
  },
  getCurrentScene: function (name) {
    return this.SceneModelCollection.findWhere({selected: true });
  },
  hideScene: function (mesh) {
    // var end = new THREE.Vector3( 0, 0, mesh.rotation.z + Math.PI);
    // var self = this;
    // var tween2 = new TWEEN.Tween(mesh.rotation).to(end).easing(TWEEN.Easing.Quadratic.Out).onStart(function () {
    //   _.each(mesh.material.materials, function (mat) {
    //     mat.transparent = true;
    //   });
    // }).onUpdate(function (a) {
    //   _.each(mesh.material.materials, function (mat) {
    //     mat.opacity = 1 - a;
    //   });
    // }).onComplete(function () {
    //   _.each(mesh.material.materials, function (mat) {
    //     mat.transparent = false;
    //     // mat.visible = false;
    //   });
    //   mesh.visible = false;
    //   self.animating = false;
    // }, 5000).start();
  },
  showScene: function (mesh) {
    // var end = new THREE.Vector3( 0, 0, mesh.rotation.z + Math.PI);
    // var self = this;
    // var tween2 = new TWEEN.Tween(mesh.rotation)
    // .to(end)
    // .easing(TWEEN.Easing.Quadratic.Out)
    // .onStart(function () {
    //   _.each(mesh.material.materials, function (mat) {
    //     mat.transparent = true;
    //     mat.opacity = 0;
    //   });
    // }).onUpdate(function (a) {
    //   _.each(mesh.material.materials, function (mat) {
    //     mat.opacity = a;
    //   });
    // }).onComplete(function () {
    //   _.each(mesh.material.materials, function (mat) {
    //     mat.transparent = false;
    //   });
    //   self.animating = false;
    // }, 5000).start();
  },
  openArtGallery: function () {
    // this.SceneModelCollection.findWhere({ selected: true }).get("object3d").visible = false
    // var artItem = new ArtItem({ name: "google", imgSrc: "images/CRUSER_v4.1_noWhite_subText.jpg" });
    // artItem.once("ART_ITEM_LOADED", function () {
    //   var sceneModel = this.SceneModelCollection.add(artItem);
    //   eventController.trigger(eventController.ADD_MODEL_TO_SCENE, sceneModel);
    // }, this);

    // sceneModel.get("object3d").visible = false;


    // var sceneModel = this.SceneModelCollection.add(obj);
    // eventController.trigger(eventController.ADD_MODEL_TO_SCENE, sceneModel);
    // this.switchScene(sceneModel.get("name"));

  },
  render: function () {
    return this;
  }
});
module.exports = SceneControls;
