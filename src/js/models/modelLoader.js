import eventController from "../controllers/eventController";
import commandController from "../controllers/commandController"
import BaseModel from "./BaseModel";
import THREE from "three";
// import utils from "../util/utils";
import materialMapList from "../data/materials/combinedMaterials";
import fontData from "../data/fonts/roboto_regular.json";
import utils from "../util/utils";

var ModelLoader = BaseModel.extend({
  initialize: function () {
    BaseModel.prototype.initialize.apply(this, arguments);
    this.initLoadingManager();
    this.addListeners();
  },
  addListeners: function () {
    eventController.on(eventController.LOAD_JSON_MODEL, this.loadModel, this);
    commandController.reply(commandController.LOAD_IMAGE_TEXTURE, this.getImageTexture, this);
    commandController.reply(commandController.LOAD_MATERIAL, this.getMaterial, this);
    commandController.reply(commandController.LOAD_VIDEO_TEXTURE, this.getVideoTexture, this);
    commandController.reply(commandController.PARSE_JSON_MODEL, this.parseJSONModelGetMesh, this);
    commandController.reply(commandController.LOAD_ENV_MAP, this.getReflectionCube, this);
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

      materials.forEach( self.setMaterialMap.bind(self) );

      var object3d = new THREE.Mesh( bufferGeo, new THREE.MeshFaceMaterial(materials) );
          object3d.name = name;
      var modelDetails = self.getModelDetailsObj(object3d, options);

      if ( options.sceneModelName ) {
        eventController.trigger(eventController.SCENE_DETAILS_LOADED, modelDetails);
      } else {
        eventController.trigger(eventController.MODEL_LOADED, modelDetails);
      }

    });
  },
  getModelDetailsObj: function ( object3d, options ) {
    return {
      name: options.name,
      sceneModelName: options.sceneModelName,
      object3d: object3d
    };
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
        if (mapURL === "refraction" ) mat[mapKey] = this.getRefractionCube();
        if (mapURL === "reflection" ) mat[mapKey] = this.getReflectionCube();
        return;
      }
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
  },
  getMaterial: function (imgSrc) {
    var material = new THREE.MeshLambertMaterial({
      map: new THREE.TextureLoader(this.manager).load( imgSrc )
    });
    return material;
  },
  getTextMesh: function (options) {
    var material = options.material ? options.material : new THREE.MeshPhongMaterial({
      color: utils.getColorPallete().text.hex,
      envMap: this.getReflectionCube()
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
  getCubeImageUrls: function () {
    var path = "textures/cubeMap/forbiddenCity/";
    var format = '.jpg';
    return [
        path + 'posx' + format, path + 'negx' + format,
        path + 'posy' + format, path + 'negy' + format,
        path + 'posz' + format, path + 'negz' + format
      ];
  },
  getReflectionCube: function () {
    var reflectionCube = new THREE.CubeTextureLoader(this.manager).load( this.getCubeImageUrls() );
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

module.exports = ModelLoader;
