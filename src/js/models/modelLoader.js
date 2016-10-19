import eventController from "../controllers/eventController";
import BaseModel from "./BaseModel";
import THREE from "three";
import data from "../data/roboto_regular.json";
import utils from "../util/utils";
import materialMapList from "../data/materialMapListJapan";

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
  loadModel: function (url, options) {
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
      eventController.trigger(eventController.MODEL_LOADED, { name: options.name, object3d: object3d });
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
          texture.shading = THREE.FlatShading;
        }
        if (options.transparent) texture.transparent = true;
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
  addVideoTexture: function () {
    var video = document.getElementById( 'video' );
		var texture = new THREE.VideoTexture( video );
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
    return texture;
  }
});

module.exports = ModelLoader;
