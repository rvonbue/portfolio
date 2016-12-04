import eventController from "../controllers/eventController";
import commandController from "../controllers/commandController"
import BaseModel from "./BaseModel";
import THREE from "three";
import materialMapList from "../data/materials/combinedMaterials";
// // import utils from "../util/utils";
// import materialMapList from "../data/materials/combinedMaterials";
// import fontData from "../data/fonts/roboto_regular.json";
// import utils from "../util/utils";
// var {}


var MaterialLibrary = BaseModel.extend({
  initialize: function () {
    BaseModel.prototype.initialize.apply(this, arguments);

    this.materials = [
      new THREE.MeshPhongMaterial,
      new THREE.MeshLambertMaterial,
      new THREE.MeshStandardMaterial,
      new THREE.MultiMaterial,
      new THREE.MeshBasicMaterial
    ];
    this.materialCollection = [];
    this.addListeners();
    console.log("Material Library", this);
  },
  addListeners: function () {
    commandController.reply(commandController.LOAD_ENV_MAP, this.getReflectionCube, this);
    commandController.reply(commandController.LOAD_MATERIAL, this.loadMaterial, this);
    commandController.reply(commandController.LOAD_IMAGE_TEXTURE, this.getImageTexture, this);
    commandController.reply(commandController.LOAD_VIDEO_TEXTURE, this.getVideoTexture, this);
  },
  getMaterial: function (oldMat) {
    // console.log("mat:::", oldMat);
    var matFromLib = this.doesMaterialExist(oldMat);
    var newMaterial;

    if ( !matFromLib ) {
      matFromLib = this.makeNewMaterial(oldMat);
      this.materialCollection.push(matFromLib);
      newMaterial =  matFromLib;
    } else {
      newMaterial = oldMat;
    }

    this.setMaterialMap(newMaterial);

    return newMaterial;
  },
  makeNewMaterial: function (mat) {
    var hasShadingType = materialMapList[mat.name] && materialMapList[mat.name].typeShading ? true : false;
    var shadingType = hasShadingType ? materialMapList[mat.name].typeShading : false;

    if ( hasShadingType ) {
      console.log("hasShadingType:", hasShadingType);
      return new THREE[shadingType]({ name: mat.name });
    } else {
      return new THREE[mat.type]({ name: mat.name });
    }

  },
  setMaterialMap: function (mat) {
    if (!materialMapList[mat.name]) return;

    var self = this;
    var materialObj = materialMapList[mat.name];

    _.each(materialObj, function (prop, key) {
      if (key === "maps") _.each(prop, function (mapObj) {
        self.setNewTexture(mapObj, mat, materialObj.mapProps);
      });
      if (key === "props") self.setMaterialAttributes(mat, prop);
    });
  },
  setNewTexture: function (mapObj, mat, options) {
    var texture = null;

    _.each(mapObj, function (mapURL, mapKey) {
      if (mapURL === null || mapURL === "null") return null;
        // console.log("--------mapKey-------------", mapKey);
      if (mapKey === "envMap") {
        // console.log("--------mat-------------", mat);
        // if (mapURL === "refraction" ) mat[mapKey] = this.getRefractionCube();
         mat[mapKey] = this.getReflectionCube(mapURL);
        return;
      };

      mat[mapKey] = new THREE.TextureLoader(this.manager).load( mapURL, function (texture) {
        if (options.repeatScale) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set( options.repeatScale, options.repeatScale );
          texture.shading = options.shading === "smooth" ? THREE.SmoothShading : THREE.FlatShading ;
        }
      });
    }, this);
  },
  setMaterialAttributes: function (mat, props) {
    // console.log("mat:", mat);
    _.each(props, function (p,k) {
      if (k === "color" || k === "emissive" || k === "specular" ) {
        mat[k] = new THREE.Color(p);
      } else {
        mat[k] = p; // set all other attributes by key and property
      }
    }, this);
  },
  doesMaterialExist: function (oldMat) {
    var newMaterial = false;

    _.each(this.materialCollection, function (mat) {
      if ( mat.name === oldMat.name ) {
        newMaterial = mat;
      }
    });

    return newMaterial;
  },
  loadMaterial: function (imgSrc) {
    var material = new THREE.MeshLambertMaterial({
      map: new THREE.TextureLoader(this.get("manager")).load( imgSrc )
    });
    console.log("loadMaterial", imgSrc);
    return material;
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
    var reflectionCube = new THREE.CubeTextureLoader(this.get("manager")).load( this.getCubeImageUrls(modelUrlBase) );
		    reflectionCube.format  = THREE.RGBFormat;
        reflectionCube.mapping = THREE.CubeReflectionMapping;

    return reflectionCube;
  },
  getRefractionCube: function () {
    var refractionCube = new THREE.CubeTextureLoader().load( this.getCubeImageUrls() );
				refractionCube.format  = THREE.RGBFormat;
        refractionCube.mapping = THREE.CubeRefractionMapping;

    return refractionCube;
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
    return new THREE.TextureLoader(this.get("manager")).load( imgSrc );
  }
});

module.exports = MaterialLibrary;
