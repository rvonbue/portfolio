import eventController from "../controllers/eventController";
import BaseModel from "./BaseModel";
import THREE from "three";
import data from "../data/roboto_regular.json";
import utils from "../util/utils";

var materialMapList = {
  woodFloor: {
    maps: [{ map: "textures/woodFloor/woodFloor_COLOR.jpg" }, { specularMap: "textures/woodFloor/woodFloor_SPEC.jpg" }, { normalMap: "textures/woodFloor/woodFloor_NRM.jpg" }],
    props: { repeatScale: 0.60, shading: "flat" },
  },
  brickWall: {
    maps: [{ map: "textures/brickWall/brickWall_COLOR.jpg" }, { specularMap: "textures/brickWall/brickWall_SPEC.jpg", normalMap: "textures/brickWall/brickWall_NRM.jpg" }],
    props: { repeatScale: 5},
  },
  marbleFloor: {
      maps: [{ map: "textures/marbleFloor/marbleFloor_COLOR.jpg" }, { specularMap: "textures/marbleFloor/marbleFloor_SPEC.jpg" }, { normalMap: "textures/marbleFloor/marbleFloor_NRM.jpg" }],
      props: { repeatScale: 1, shading: "flat" }
  },
  airCond: {
    maps: [{ map: "textures/airCond.jpg" }],
    props: { repeatScale: 0.15, shading: "flat" }
  },
  roof: {
      maps: [{ map: "textures/roof.jpg" }],
      props: { repeatScale: 0.25, shading: "flat" }
  },
  grass: {
    maps: [{ map: "textures/grass/grass.jpg" }],
    props: { repeatScale: 0.25, shading: "flat" }
  },
  girder: {
  },
  glass: {
    props: [{opacity: .25 }]
  },
  roofTop: {
      maps: [
        { map: "textures/paintedWoodGreen/woodPlanksPainted_COLOR.jpg" },
        { specularMap: "textures/paintedWoodGreen/woodPlanksPainted_SPEC.jpg" },
        { normalMap: "textures/paintedWoodGreen/woodPlanksPainted_NRM.jpg" }
      ],
      props: { repeatScale: 0.75, shading: "flat" }
  },
  roofLog: {
      maps: [{ map: "textures/paintedWoodGreen/woodPlanksPainted.jpg" }],
      props: { repeatScale: 0.25, shading: "smooth" }
  },
  woodBeamPrimary: {
      maps: [
        { map: "textures/woodBare/woodBare_COLOR.jpg" },
        { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
        { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
      ],
      props: { repeatScale: 10, shading: "flat" }
  },
  woodBeamSecondary: {
    maps: [
      { map: "textures/woodBare/woodBare_COLOR.jpg" },
      { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
      { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
    ],
    props: { repeatScale: 4, shading: "flat" }
  },
  lampLight: {
    maps: [
      { map: "textures/japan_character.png" }
    ],
    props: { repeatScale: 1, shading: "flat" }
  },
  stucco:{
    maps: [
      { map: "textures/stucco/stucco_COLOR.jpg" },
      { specularMap: "textures/stucco/stucco_SPEC.jpg" },
      { normalMap: "textures/stucco/stucco_NRM.jpg" }
    ],
    props: { repeatScale: 20, shading: "flat" }
  }
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
            self.setMaterialAttr(mat);
          }
      });
      var object3d = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(materials) );
      object3d.recieveShadows = true;
      eventController.trigger(eventController.MODEL_LOADED, { name: options.name, object3d: object3d });
    });
  },
  setMaterialAttr: function (mat) {
    var self = this;
    var materialObj = materialMapList[mat.name];
    _.each(materialObj, function (prop, key) {
      if (key === "maps") {
        _.each(prop, function (mapObj) { self.getNewTexture(mapObj, mat, materialObj.props); });
        return;
      }
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
  addVideoTexture: function () {
    var video = document.getElementById( 'video' );
		var texture = new THREE.VideoTexture( video );
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
    return texture;
  }
});

module.exports = ModelLoader;
