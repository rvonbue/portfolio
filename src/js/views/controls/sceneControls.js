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
    home: null,
    movieTheater: null,
    artGallery: null,
  },
  initialize: function (options) {
    this.mouse = new THREE.Vector2();
    this.scene = options.scene;
    this.camera = options.camera;
    this.addListeners(options.el);
    this.loadEnvironmentMap();
    this.modelLoader = new ModelLoader();
    this.raycaster = new THREE.Raycaster();
    this.loadInitialScene("home");
    this.animating = false;
  },
  addListeners: function (el) {
    var self = this;
    el.on("mousemove", "canvas", function (evt) { self.onMouseMove(evt); });
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  },
  onMouseMove: function (evt) {
    evt.preventDefault();
		this.mouse.x = ( evt.clientX / this.width ) * 2 - 1;
		this.mouse.y = - ( evt.clientY / this.height ) * 2 + 1;
    this.raycaster.setFromCamera( this.mouse, this.camera );
    var closestObject = this.findClosestObject(this.raycaster.intersectObjects( this.scene.children ));
    eventController.trigger(eventController.HOVER_NAVIGATION, closestObject);
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
    this.load3dView(name);
  },
  load3dView: function (name) {
    if (this.get(name) === null) {
      var view3d = this.get3dView(name);
      this.set(name, view3d);
    }
  },
  get3dView: function (name) {
    var newView;
    switch(name) {
      case "home":
          newView = new HomeView({ name: name });
          break;
      case "movieTheater":
          newView = new MovieTheaterView3d();
          break;
      case "artGallery":
          newView = new ArtGalleryView3d();
          break;
      default:
          break;
    }
    return newView;
  },
  loadEnvironmentMap: function (reflectionCube) {
    var format = '.jpg';
    var path = "textures/yokohama3/";
    var size = 30;
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
    //
    // var modifier = new THREE.SubdivisionModifier(3);
    // modifier.modify( skyGeometry );
    console.log("THREE:", THREE);
  	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
  	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
    skyBox.position.y = size / 2;
  	this.scene.add( skyBox );
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
  setMeshInitRotation: function (mesh) {
    mesh.rotation.z = Math.PI;
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
