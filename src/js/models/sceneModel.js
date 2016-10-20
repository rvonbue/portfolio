import eventController from "../controllers/eventController";
import BaseModel from "./BaseModel";

var SceneModel = Backbone.Model.extend({
  defaults: {
    "name": "Caesar_Salad",
    "object3d": null,
    "selected": false,
    "hover": false,
    "ready": true,
    "interactive": true,
    "size": { width: 0, height: 0 },
    "position": {x: 0, y: 0 }
  },
  initialize: function( options ) {
    this.set("name", options.name);
    options.object3d.name = options.name;
    this.set("object3d", options.object3d);
    this.addModelListeners();
  },
  addModelListeners: function () {
    this.on("change:selected", this.onChangeSelected);
    this.on("change:hover", this.onChangeHover);
  },
  getPosition: function () {
    var object3dPos = this.get("object3d").position;
    return { x: object3dPos.x, y: object3dPos.y, z: object3dPos.z };
  },
  getSize: function () {
    var object3d = this.get("object3d");
    var height = Math.abs(object3d.geometry.boundingBox.max.y) + Math.abs(object3d.geometry.boundingBox.min.y);
    var width = Math.abs(object3d.geometry.boundingBox.max.x) + Math.abs(object3d.geometry.boundingBox.min.x);
    var length = Math.abs(object3d.geometry.boundingBox.max.z) + Math.abs(object3d.geometry.boundingBox.min.z);
    return { w: width, h: height, l: length };
  },
  onChangeSelected: function () {
    console.log("HI IM " + this.get("name") + " and I'm selected = " + this.get("selected"));
    console.log("Here is my Object:", this.get("object3d"));
    // this.get("object3d").visible = this.get("selected");
  },
  onChangeHover: function () {
    console.log("HI IM " + this.get("name") + " and I'm HOVERED = " + this.get("hover"));
    this.toggleLampEmitMaterial();
    console.log(_.find(this.get("object3d").material.materials, function(item) {
        return item.name == "lampLightEmit";
    }));

  },
  getLampLightMaterial: function () {
    return _.find(this.get("object3d").material.materials, function(item) {
        return item.name == "lampLightEmit";
    });
  },
  toggleLampEmitMaterial:function () {
    var lampLightEmitMaterial = this.getLampLightMaterial();

    if (this.get("hover") === true ) {
      lampLightEmitMaterial.emissive.r = 0.80;
      lampLightEmitMaterial.emissive.g = 0.15;
      lampLightEmitMaterial.emissive.b = 0.005;
    } else {
      lampLightEmitMaterial.emissive.r = 0;
      lampLightEmitMaterial.emissive.g = 0;
      lampLightEmitMaterial.emissive.b = 0;
    }
  }
});

module.exports = SceneModel;
