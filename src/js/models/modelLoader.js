import eventController from "../controllers/eventController";
import BaseModel from "./BaseModel";
import THREE from "three";

var materialMapList = {
  book: { map: "textures/book/book_COLOR.png", spec: "textures/book/book_SPEC.png", disp: "textures/book/book_DISP.png"},
  wall: { map: "textures/leather/leather_COLOR.png", spec: "textures/leather/leather_SPEC.png", disp: "textures/leather/leather_DISP.png", repeatScale: 5 },
  wood: { map: "textures/wood/wood_COLOR.png", spec: "textures/wood/wood_SPEC.png", disp: "textures/book/book_DISP.png", repeatScale: 5, shininess: 50 },
  woodFloor: { map: "textures/woodFloor/woodFloor_COLOR.png", spec: "textures/woodFloor/woodFloor_SPEC.png", disp: "textures/woodFloor/woodFloor_DISP.png", repeatScale: 10 },
  leather: { map: "textures/leather/leather_COLOR.png", spec: "textures/leather/leather_SPEC.png", disp: "textures/leather/leather_DISP.png", repeatScale: 12},
  metal: { map: "textures/leather/leather_COLOR.png", spec: "textures/leather/leather_SPEC.png", disp: "textures/leather/leather_DISP.png", repeatScale: 5, shading: "flat" },
  plastic: { map: null, spec: null, disp: null, repeatScale: 5 },
  plasticRed: { map: null, spec: null, disp: null, repeatScale: 5 },
  plasticBlack: { map: null, spec: null, disp: null, repeatScale: 5 },
  plasticWhite: { map: null, spec: null, disp: null, repeatScale: 5 },
  rug: { map: "textures/rug/rug_COLOR.png", spec: "textures/rug/rug_SPEC.png", disp: "textures/rug/rug_DISP.png", alpha: true },
  cityScape: {map: "textures/cityScape.jpg" },
  computerScreen: {map: "textures/multibackground.png" },
  tvScreen: {map: "video" },
  plushRed: { map: null, spec: null, disp: null, repeatScale: 5 },
  videoGameCabinet: { map: "textures/videoGameCabinet/videoGameCabinet_COLOR.png", spec: "textures/videoGameCabinet/videoGameCabinet_SPEC.png" }
};

var ModelLoader = BaseModel.extend({
  initialize: function () {
    BaseModel.prototype.initialize.apply(this, arguments);
    this.initLoadingManager();
    eventController.on(eventController.LOAD_NEW_SCENE, this.loadModel, this);
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
        // _.each(materials, function (m) {
          // m.map = self.getNewTexture(materialMapList[m.name], "map");
          // m.specularMap = self.getNewTexture(materialMapList[m.name], "spec");
          // m.displacemntMap = self.getNewTexture(materialMapList[m.name], "disp");
      // });
      var object = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(materials) );
      eventController.trigger(eventController.MODEL_LOADED, { name: options.name, object3d: object });
    });
  },
  getNewTexture: function (options, optKey) {
    console.log("options:--------", options);
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
