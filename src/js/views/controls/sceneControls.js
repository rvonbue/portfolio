import eventController from "../../controllers/eventController";
import BaseModel from "../../models/BaseModel";
import ModelLoader from "../../models/modelLoader";
import SceneCollection from "../../collections/SceneModelCollection";
import ArtGalleryView3d from "../3d/artGalleryView3d";
import HomeView3d from "../3d/homeView3d";
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
    // _.bindAll(this, "updateCamera");
    // eventController.on(eventController.SWITCH_SCENE, this.switchScene, this );
    // eventController.on(eventController.MODEL_LOADED, this.modelLoaded, this );
    this.sceneCollection = new SceneCollection();
    this.modelLoader = new ModelLoader();
    this.loadInitialScene("artGallery");
    this.animating = false;
  },
  loadInitialScene: function (name) {
    this.load3dView(name);
    // eventController.trigger(eventController.LOAD_NEW_SCENE, "models/" + name +".json", {name: name});
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
          newView = new HomeView3d();
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
  switchScene: function (name) {
    // eventController.once(eventController.MODEL_LOADED, this.modelLoaded, this);
    console.log("switchScene: name ---",  name);
    if (this.animating) return false;
    if( name === "artGallery") {
      this.openArtGallery();
      return false;
    }
    var sceneModel = this.sceneCollection.findWhere({name: name });
    if ( sceneModel ) {  //  if scene exists animate else load new scene
      // animate scene
      if (sceneModel.get("selected")) return false;
      if (  this.sceneCollection.length === 1 )  {
        sceneModel.set("selected", true);
        sceneModel.get("object3d").visible = true;
      } else {
        this.animateSceneTransition(sceneModel);
      }
    } else {
      // load Model
      eventController.trigger(eventController.LOAD_NEW_SCENE, "models/" + name +".json", {name: name});
    }
  },
  modelLoaded: function (obj) {
    if (obj.name === "artGallery") {
      var sceneModel = this.sceneCollection.add(obj);
      sceneModel.get("object3d").visible = false;
    } else {
      var sceneModel = this.sceneCollection.add(obj);
      sceneModel.get("object3d").visible = false;
      eventController.trigger(eventController.ADD_MODEL_TO_SCENE, sceneModel);
      this.switchScene(sceneModel.get("name"));
    }
  },
  animateSceneTransition: function (sceneModel) {
    this.animating = true;
    var object3d = sceneModel.get("object3d");
    var currentSceneModel = this.getCurrentScene();
    this.setMeshInitRotation(object3d);
    object3d.visible = true;
    sceneModel.set("selected", true);

    currentSceneModel.set("selected", false);
    this.hideScene(currentSceneModel.get("object3d"));
    this.showScene(sceneModel.get("object3d"));
  },
  getCurrentScene: function (name) {
    return this.sceneCollection.findWhere({selected: true });
  },
  setMeshInitRotation: function (mesh) {
    mesh.rotation.z = Math.PI;
  },
  hideScene: function (mesh) {
    var end = new THREE.Vector3( 0, 0, mesh.rotation.z + Math.PI);
    var self = this;
    var tween2 = new TWEEN.Tween(mesh.rotation).to(end).easing(TWEEN.Easing.Quadratic.Out).onStart(function () {
      _.each(mesh.material.materials, function (mat) {
        mat.transparent = true;
      });
    }).onUpdate(function (a) {
      _.each(mesh.material.materials, function (mat) {
        mat.opacity = 1 - a;
      });
    }).onComplete(function () {
      _.each(mesh.material.materials, function (mat) {
        mat.transparent = false;
        // mat.visible = false;
      });
      mesh.visible = false;
      self.animating = false;
    }, 5000).start();
  },
  showScene: function (mesh) {
    var end = new THREE.Vector3( 0, 0, mesh.rotation.z + Math.PI);
    var self = this;
    var tween2 = new TWEEN.Tween(mesh.rotation)
    .to(end)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onStart(function () {
      _.each(mesh.material.materials, function (mat) {
        mat.transparent = true;
        mat.opacity = 0;
      });
    }).onUpdate(function (a) {
      _.each(mesh.material.materials, function (mat) {
        mat.opacity = a;
      });
    }).onComplete(function () {
      _.each(mesh.material.materials, function (mat) {
        mat.transparent = false;
      });
      self.animating = false;
    }, 5000).start();
  },
  openArtGallery: function () {
    this.sceneCollection.findWhere({ selected: true }).get("object3d").visible = false
    var artItem = new ArtItem({ name: "google", imgSrc: "images/CRUSER_v4.1_noWhite_subText.jpg" });
    artItem.once("ART_ITEM_LOADED", function () {
      var sceneModel = this.sceneCollection.add(artItem);
      eventController.trigger(eventController.ADD_MODEL_TO_SCENE, sceneModel);
    }, this);

    // sceneModel.get("object3d").visible = false;


    // var sceneModel = this.sceneCollection.add(obj);
    // eventController.trigger(eventController.ADD_MODEL_TO_SCENE, sceneModel);
    // this.switchScene(sceneModel.get("name"));

  },
  render: function () {
    return this;
  }
});
module.exports = SceneControls;
