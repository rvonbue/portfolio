import eventController from "../controllers/eventController";
import BaseModel from "./BaseModel";
import THREE from "three";
import data from "../data/roboto_regular.json";
import utils from "../util/utils";
import materialMapListJapan from "../data/materials/materialMapJapan";
import materialMapListWebDev from "../data/materials/materialMapWebDev";
import materialMapList3dAnimation from "../data/materials/materialMap3dAnimation";

var materialMapList = _.extendOwn(materialMapListJapan, materialMapList3dAnimation, materialMapListWebDev);
var ModelLoader = BaseModel.extend({
  initialize: function () {
    BaseModel.prototype.initialize.apply(this, arguments);
    this.initLoadingManager();
    eventController.on(eventController.LOAD_JSON_MODEL, this.loadModel, this);
  },
  initLoadingManager: function () {
    this.manager = new THREE.LoadingManager();
    this.manager.onProgress = function ( item, loaded, total ) {
      // console.log( item, loaded, total );
    };
  },
  loadModel: function (url, options, whichCallback) {
    var self = this;
    var loader =  new THREE.JSONLoader(this.manager);
    loader.load(url, function ( geometry, materials ) {
        geometry.computeBoundingBox();
        _.each(materials, function (mat) {
          if (materialMapList[mat.name]) {
            self.setMaterialMap(mat);
          }
      });
      var object3d = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(materials) );
      var modelDetails = { name: options.name, sceneModelName: options.sceneModelName, object3d: object3d };
      if ( options.sceneModelName ) {
        setTimeout(function () {
          eventController.trigger(eventController.SCENE_DETAILS_LOADED, modelDetails);
        }, 15);
      } else {
        eventController.trigger(eventController.MODEL_LOADED, modelDetails);
      }

    });
  },
  setMaterialMap: function (mat) {
    var self = this;
    var materialObj = materialMapList[mat.name];
    _.each(materialObj, function (prop, key) {
      if (key === "maps") {
        _.each(prop, function (mapObj) { self.getNewTexture(mapObj, mat, materialObj.mapProps); });
      }
      if (key === "props") self.setMaterialAttributes(mat, prop);
    }, this);
  },
  getNewTexture: function (mapObj, mat, options) {
    var texture = null;
    _.each(mapObj, function (mapURL, mapKey) {
      if (mapURL === null || mapURL === "null") return null;
      mat[mapKey] = new THREE.TextureLoader().load( mapURL, function (texture) {
        if (options.repeatScale) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set( options.repeatScale, options.repeatScale );
          texture.shading = options.shading === "smooth" ? THREE.SmoothShading : THREE.FlatShading ;
        }
      });
    });
    return texture;
  },
  setMaterialAttributes: function (mat, props) {
    // console.log("mat:", mat);
    _.each(props, function (p,k) {
      if (k === "color" || k === "emissive" || k === "specular" ) {
        this.setMaterialColor(mat, k, p);
      } else {
        mat[k] = p; // set all other attributes by key and property
      }
    }, this);
  },
  setMaterialColor: function (mat, k, color) {
    mat[k] = new THREE.Color(color);
  },
  parseJSON: function (json) {
    var loader = new THREE.JSONLoader();
    var model = loader.parse(json);
    _.each(model.materials, function (mat) {
      if (materialMapList[mat.name]) {
        this.setMaterialMap(mat);
      }
    }, this);
    return model;
  },
  addVideoTexture: function () {
    var video = document.getElementById( 'video' );
		var texture = new THREE.VideoTexture( video );
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
    return texture;
  }
});

module.exports = ModelLoader;
