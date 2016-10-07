import eventController from "../controllers/eventController";
import BaseModel from "./BaseModel";
import THREE from "three";
import data from "../data/roboto_regular.json";
import utils from "../util/utils";

var materialMapList = {
  woodFloor: { maps: [{map: "textures/woodFloor.jpg"}, {displacementMap: null}, {specularMap: null}], repeatScale: 1, mat: "phong" },
  window: { opacity: .25 }
};

var ModelLoader = BaseModel.extend({
  initialize: function () {
    BaseModel.prototype.initialize.apply(this, arguments);
    this.initLoadingManager();
    eventController.on(eventController.LOAD_JSON_MODEL, this.loadModel, this);
  },
  initLoadingManager: function () {
    this.manager = new THREE.LoadingManager();
    this.manager.onProgress = function ( item, loaded, total ) {
      console.log( item, loaded, total );
    };
  },
  loadModel: function (url, options) {
    var self = this;
    var loader =  new THREE.JSONLoader(this.manager);

    loader.load(
    	url,
    	function ( geometry, materials ) {
        geometry.computeBoundingBox();
        _.each(materials, function (mat) {
          if (materialMapList[mat.name]) {
            self.setMaterialAttr(mat);
          }
      });
      var object3d = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(materials) );
      eventController.trigger(eventController.MODEL_LOADED, { name: options.name, object3d: object3d });
    });
  },
  setMaterialAttr: function (mat) {
    _.each(materialMapList[mat.name], function (prop, key) {
      if (key === "maps") {

        return;
      }
      console.log('key', key);
      console.log('prop', prop);
      // mat[key] = prop;
    });
  },
  getNewTexture: function (options, optKey) {
    if (options && !options[optKey]) return null;
    if (options[optKey] === "video") return this.addVideoTexture();
    return new THREE.TextureLoader().load( options[optKey], function (texture) {
      if (options.repeatScale) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( options.repeatScale, options.repeatScale );
      }
      if (options.alpha) {
        texture.alpha = options.alpha;
      }
      if (options.shading) {
        texture.shading = THREE.FlatShading;
      }
    });
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
