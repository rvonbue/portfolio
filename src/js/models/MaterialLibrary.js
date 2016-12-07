import eventController from "../controllers/eventController";
import commandController from "../controllers/commandController"
import BaseModel from "./BaseModel";
import THREE from "three";
import materialMapList from "../data/materials/combinedMaterials";
// // import utils from "../util/utils";

var MaterialLibrary = BaseModel.extend({
  initialize: function () {
    BaseModel.prototype.initialize.apply(this, arguments);

    this.materialCollection = [];
    this.addListeners();
  },
  addListeners: function () {
    commandController.reply(commandController.LOAD_ENV_MAP, this.getReflectionCube, this);
    commandController.reply(commandController.LOAD_MATERIAL, this.loadMaterial, this);
    commandController.reply(commandController.LOAD_VIDEO_TEXTURE, this.getVideoTexture, this);
    commandController.reply(commandController.LOAD_IMAGE_TEXTURE, this.getImageTexture, this);
  },
  getMaterial: function (oldMat) {
    var matFromLib = this.doesMaterialExist(oldMat);
    var newMaterial;

    if ( !matFromLib ) { // if material doesn't exist
      matFromLib = this.makeNewMaterial(oldMat);
      this.materialCollection.push(matFromLib);
      newMaterial =  matFromLib;
    } else {
      newMaterial = matFromLib;
    }
    this.setMaterialProperties(newMaterial);

    return newMaterial;
  },
  makeNewMaterial: function (mat) {
    var matmaplist = materialMapList[mat.name];
    var hasProps = matmaplist && matmaplist.props;
    var hasShadingType = hasProps && matmaplist.props.shadingType ? true : false;
    var shadingType = hasShadingType ? matmaplist.props.shadingType : false;

    if ( hasShadingType ) {
      return new THREE[shadingType]({ name: mat.name });
    } else {
      return new THREE[mat.type]({ name: mat.name });
    }

  },
  setMaterialProperties: function (mat) {
    if (!materialMapList[mat.name]) return;

    var self = this;
    var materialObj = materialMapList[mat.name];

    _.each(materialObj, function (value, key) {

      if (key === "maps") {
        _.each(value, function (mapObj) {
          self.setNewTexture(mapObj, mat, materialObj.mapProps);
        });
      }

      if (key === "props") {
        self.setMaterialAttributes(mat, value);
      }

    });
  },
  setNewTexture: function (mapObj, mat, options) {
    var texture = null;

    _.each(mapObj, function (mapURL, mapKey) {

      switch(mapKey) {
        case "envMap":
          mat[mapKey] = this.getReflectionCube(mapURL);
          break;
        default:
          mat[mapKey] = this.getImageTexture(mapURL, options);
      }

    }, this);

  },
  getImageTexture: function (mapURL, options) {
    var texture = new THREE.TextureLoader(this.get("manager")).load( mapURL, function (texture) {
      if (options && options.repeatScale) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( options.repeatScale, options.repeatScale );
        texture.shading = options.shading === "smooth" ? THREE.SmoothShading : THREE.FlatShading ;
      }
    });
    return texture;
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
    var matInCollection = this.materialCollection[oldMat.name];

    if (matInCollection) newMaterial = matInCollection;

    return newMaterial;
  },
  loadMaterial: function (imgSrc) {
    var material = new THREE.MeshLambertMaterial({
      map: new THREE.TextureLoader(this.get("manager")).load( imgSrc )
    });
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
  }
});

module.exports = MaterialLibrary;
