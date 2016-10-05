import eventController from "../controllers/eventController";
import BaseModel from "./BaseModel";
import THREE from "three";
import WorldTranslator from "../util/worldTranslator";
import sceneModel from "./sceneModel";

var ArtItem = BaseModel.extend({
  initialize: function (options) {
    sceneModel.prototype.initialize.apply(this, arguments);
    this.imgSrc = "/images/artGallery/" + options.imgSrc;
    this.loadTexture();
  },
  loadTexture: function () {
    var self = this;
    new THREE.TextureLoader().load( this.imgSrc, function (texture) {
      self.set3dObject(texture);
    });
  },
  set3dObject: function (texture) {
    var worldScale = WorldTranslator.translateWidthHeight(texture.image.width, texture.image.height);
    var depth = 0.5;
  	var geometry = new THREE.BoxBufferGeometry( worldScale.width, worldScale.height, depth );
  	var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );
    var cube = new THREE.Mesh( geometry, material );
    this.set("object3d", cube);
    this.trigger("READY", cube);
  },
  getSceneModelConstObj: function () {
    return { name: this.get("name"), object3d: this.get("object3d") };
  }
});
module.exports = ArtItem;
