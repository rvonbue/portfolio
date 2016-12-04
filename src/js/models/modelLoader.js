import eventController from "../controllers/eventController";
import commandController from "../controllers/commandController"
import BaseModel from "./BaseModel";
import THREE from "three";
import MaterialLibrary from "./MaterialLibrary";
// import utils from "../util/utils";
import materialMapList from "../data/materials/combinedMaterials";
import fontData from "../data/fonts/roboto_regular.json";
import utils from "../util/utils";

var ModelLoader = BaseModel.extend({
  initialize: function () {
    BaseModel.prototype.initialize.apply(this, arguments);
    this.initLoadingManager();
    this.materialLibrary = new MaterialLibrary({ manager: this.manager });
    this.addListeners();
  },
  addListeners: function () {
    eventController.on(eventController.LOAD_JSON_MODEL, this.loadModel, this);
    commandController.reply(commandController.PARSE_JSON_MODEL, this.parseJSONModelGetMesh, this);
    commandController.reply(commandController.GET_TEXT_MESH, this.getTextMesh, this);
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
    var loader = new THREE.JSONLoader( this.manager );
    var n = url.lastIndexOf('/');
    var name = url.substring(n + 1).slice(0,-5);

    loader.load(url, function ( geometry, materials ) {
      var bufferGeo = new THREE.BufferGeometry();
          bufferGeo.fromGeometry ( geometry );
          bufferGeo.computeBoundingBox();

      var newMaterials = self.getMeshMaterials(materials);
      materials = null;
      
      var object3d = new THREE.Mesh( bufferGeo, new THREE.MeshFaceMaterial(newMaterials) );
          object3d.name = name;

      var modelDetails = self.getModelDetailsObj(object3d, options);

      if ( options.sceneModelName ) {
        eventController.trigger(eventController.SCENE_DETAILS_LOADED, modelDetails);
      } else {
        eventController.trigger(eventController.MODEL_LOADED, modelDetails);
      }

    });
  },
  getMeshMaterials: function (materials) {
    var matLib = this.materialLibrary;
    var newMaterials = [];

    materials.forEach( function (mat) {
      newMaterials.push(this.materialLibrary.getMaterial(mat));
    }, this);

    return newMaterials;
  },
  getModelDetailsObj: function ( object3d, options ) {
    return {
      name: options.name,
      sceneModelName: options.sceneModelName,
      object3d: object3d
    };
  },
  parseJSON: function (json) {
    var loader = new THREE.JSONLoader(this.manager);
    var model = loader.parse(json);
    // console.log("-------model.materials-----length--", model.materials.length);
    model.materials = this.getMeshMaterials(model.materials);

    return model;
  },
  parseJSONModelGetMesh: function (json) {
    var model = this.parseJSON(json);
    return new THREE.Mesh(model.geometry, model.materials[0]);
  },
  getTextMesh: function (options) {
    var material = options.material ? options.material : new THREE.MeshPhongMaterial({
      color: utils.getColorPallete().text.hex,
      // envMap: this.materialLibrary.getReflectionCube()
      // emissive:  utils.getColorPallete().text.hex
     });

    var	textGeo = new THREE.TextGeometry( options.text || "defualt", {
      font: new THREE.Font(fontData),
      height: options.height || 0.75,
      size: options.size || 2 ,
      curveSegments: 4,
      bevelThickness: 2,
      bevelSize: 1.5,
      bevelSegments: 3
    });

    textGeo.computeBoundingBox();
    return new THREE.Mesh( textGeo, material );
  },
});

module.exports = ModelLoader;
