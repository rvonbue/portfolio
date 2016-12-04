import eventController from "../controllers/eventController";
import commandController from "../controllers/commandController"
import BaseModel from "./BaseModel";
import THREE from "three";
// // import utils from "../util/utils";
// import materialMapList from "../data/materials/combinedMaterials";
// import fontData from "../data/fonts/roboto_regular.json";
// import utils from "../util/utils";
// var {}


var MaterialLibrary = BaseModel.extend({
  initialize: function () {
    BaseModel.prototype.initialize.apply(this, arguments);
    this.materialCollection = [
      THREE.MeshPhongMaterial,
      THREE.MeshLambertMaterial,
      THREE.MeshStandardMaterial,
      THREE.MultiMaterial,
      THREE.MeshBasicMaterial
    ];
  },
  addListeners: function () {
    commandController.reply(commandController.LOAD_ENV_MAP, this.getReflectionCube, this);
  },
  getMaterial: function () {

  },
  getCubeImageUrls: function (modelUrlBase) {
    var path = "textures/cubeMap/" + modelUrlBase + "/";
    var format = '.png';
    return [
      path + 'posx' + format, path + 'negx' + format,
      path + 'posy' + format, path + 'negy' + format,
      path + 'posz' + format, path + 'negz' + format
    ];
  },
  getReflectionCube: function (modelUrlBase) {
    var reflectionCube = new THREE.CubeTextureLoader(this.manager).load( this.getCubeImageUrls(modelUrlBase) );
		    reflectionCube.format  = THREE.RGBFormat;
        reflectionCube.mapping = THREE.CubeReflectionMapping;

    return reflectionCube;
  },
  getRefractionCube: function () {
    var refractionCube = new THREE.CubeTextureLoader().load( this.getCubeImageUrls() );
				refractionCube.format  = THREE.RGBFormat;
        refractionCube.mapping = THREE.CubeRefractionMapping;

    return refractionCube;
  }
});

module.exports = MaterialLibrary;
