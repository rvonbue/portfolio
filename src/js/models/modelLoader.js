import eventController from "../controllers/eventController";
import commandController from "../controllers/commandController"
import BaseModel from "./BaseModel";
import THREE from "three";
// import utils from "../util/utils";
import materialMapList from "../data/materials/combinedMaterials";

var ModelLoader = BaseModel.extend({
  initialize: function () {
    BaseModel.prototype.initialize.apply(this, arguments);
    this.initLoadingManager();
    this.addListeners();

  },
  addListeners: function () {
    eventController.on(eventController.LOAD_JSON_MODEL, this.loadModel, this);
    commandController.reply(commandController.LOAD_IMAGE_TEXTURE, this.getImageTexture, this);
    commandController.reply(commandController.LOAD_VIDEO_TEXTURE, this.getVideoTexture, this);
    commandController.reply(commandController.PARSE_JSON_MODEL, this.parseJSONModelGetMesh, this);
  },
  initLoadingManager: function () {
    this.manager = new THREE.LoadingManager();
    this.manager.onStart = function ( item, loaded, total) {
      // console.log("loader on start----------------1----------")
      eventController.trigger(eventController.ITEM_START_LOAD, loaded, total);
    };
    this.manager.onProgress = function ( item, loaded, total ) {
      eventController.trigger(eventController.ITEM_LOADED, loaded, total);
    };

    this.manager.onLoad = function ( item, loaded, total ) {
      // setTimeout(function () {
      eventController.trigger(eventController.ALL_ITEMS_LOADED);
      // }, 1500);
    };

  },
  loadModel: function (url, options) {
    var self = this;
    var loader =  new THREE.JSONLoader(this.manager);

    loader.load(url, function ( geometry, materials ) {
        var bufferGeo = new THREE.BufferGeometry();
        bufferGeo.fromGeometry ( geometry );
        bufferGeo.computeBoundingBox();
        _.each(materials, function (mat) {
          if (materialMapList[mat.name]) {
            self.setMaterialMap(mat);
          }
      });

      var object3d = new THREE.Mesh( bufferGeo, new THREE.MeshFaceMaterial(materials) );
      var modelDetails = {
        name: options.name,
        sceneModelName: options.sceneModelName,
        object3d: object3d
      };

      if ( options.sceneModelName ) {
        eventController.trigger(eventController.SCENE_DETAILS_LOADED, modelDetails);
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
        _.each(prop, function (mapObj) { self.setNewTexture(mapObj, mat, materialObj.mapProps); });
      }
      if (key === "props") self.setMaterialAttributes(mat, prop);
    }, this);
  },
  setNewTexture: function (mapObj, mat, options) {
    var texture = null;
    var self = this;
    _.each(mapObj, function (mapURL, mapKey) {
      if (mapURL === null || mapURL === "null") return null;
      mat[mapKey] = new THREE.TextureLoader(self.manager).load( mapURL, function (texture) {
        if (options.repeatScale) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set( options.repeatScale, options.repeatScale );
          texture.shading = options.shading === "smooth" ? THREE.SmoothShading : THREE.FlatShading ;
        }
      });
    });
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
    var loader = new THREE.JSONLoader(this.manager);
    var model = loader.parse(json);
    _.each(model.materials, function (mat) {
      if (materialMapList[mat.name]) {
        this.setMaterialMap(mat);
      }
    }, this);
    return model;
  },
  parseJSONModelGetMesh: function (json) {
    console.log("json", json);
    var model = this.parseJSON(json);
    return new THREE.Mesh(model.geometry, model.materials[0]);
  },
  getVideoTexture: function (src) {
    var video = document.createElement( 'video' );
    video.src = src;
  	video.play();
    video.loop = true;

		var videoTexture = new THREE.VideoTexture( video );
		videoTexture.minFilter = THREE.LinearFilter;
		videoTexture.magFilter = THREE.LinearFilter;

    var material = new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true } );
    return material
  },
  getImageTexture: function (imgSrc) {
    return new THREE.TextureLoader(this.manager).load( imgSrc );
  }
});

module.exports = ModelLoader;
