import eventController from "../controllers/eventController";
import BaseModel from "./BaseModel";
import THREE from "three";

var materialMapList = {
  book: { map: "textures/book/book_COLOR.png", specularMap: "textures/book/book_SPEC.png", displacementMap: "textures/book/book_DISP.png"},
  wall: { map: "textures/leather/leather_COLOR.jpg", repeatScale: 5 },
  wood: { map: "textures/wood/wood_COLOR.png", specularMap: "textures/wood/wood_SPEC.png", displacementMap: "textures/book/book_DISP.png", repeatScale: 5, shininess: 50 },
  woodFloor: { map: "textures/woodFloor.jpg", repeatScale: 10 },
  leather: { map: "textures/leather/leather_COLOR.png", specularMap: "textures/leather/leather_SPEC.png", displacementMap: "textures/leather/leather_DISP.png", repeatScale: 12},
  metal: { map: "textures/leather/leather_COLOR.png", specularMap: "textures/leather/leather_SPEC.png", displacementMap: "textures/leather/leather_DISP.png", repeatScale: 5, shading: "flat" },
  plastic: { map: null, specularMap: null, displacementMap: null, repeatScale: 5 },
  plasticRed: { map: null, specularMap: null, displacementMap: null, repeatScale: 5 },
  plasticBlack: { map: null, specularMap: null, displacementMap: null, repeatScale: 5 },
  plasticWhite: { map: null, specularMap: null, displacementMap: null, repeatScale: 5 },
  rug: { map: "textures/rug/rug_COLOR.png", specularMap: "textures/rug/rug_SPEC.png", displacementMap: "textures/rug/rug_DISP.png", alpha: true },
  cityScape: {map: "textures/cityScape.jpg" },
  computerScreen: {map: "textures/multibackground.png" },
  tvScreen: {map: "video" },
  plushRed: { map: null, specularMap: null, displacementMap: null, repeatScale: 5 },
  videoGameCabinet: { map: "textures/videoGameCabinet/videoGameCabinet_COLOR.png", specularMap: "textures/videoGameCabinet/videoGameCabinet_SPEC.png" }
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
        console.log("materials", materials);
        _.each(materials, function (m) {
          // console.log("material:name: ", m.name);
          if (m.name === "woodFloor") {

            _.each(materialMapList[m.name], function (key, prop) {
              var woodFloor = new THREE.TextureLoader().load( "textures/woodFloor.jpg", function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set( 2, 2 );
              });
              console.log("material:---------woodFloor", woodFloor);
              m.map = woodFloor;
            });

          }

          // m.map = self.getNewTexture(materialMapList[m.name], "map");
          // m.specularMap = self.getNewTexture(materialMapList[m.name], "spec");
          // m.displacementMap: = self.getNewTexture(materialMapList[m.name], "disp");
      });
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
