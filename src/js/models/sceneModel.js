// import eventController from "../controllers/eventController";
import BaseModel from "./BaseModel";
import utils from "../util/utils";

var SceneModel = Backbone.Model.extend({
  defaults: {
    "name": "Caesar_Salad",
    "object3d": null,
    "text3d": null,
    "selected": false,
    "hover": false,
    "ready": true,
    "interactive": true,
    "doors": null,
    "hoverLamps": null,
    "hoverLights": null
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
    console.log("Here is my Object:", this);
    this.toggleDoors();
    this.toggleTextVisiblilty();
  },
  toggleDoors: function () {
    _.each(this.get("doors"), function (doorMesh) {
      doorMesh.position.x += 0.5;
    });
  },
  toggleTextVisiblilty:function () {
    this.get("text3d").visible = !this.get("selected");
  },
  onChangeHover: function () {
    console.log("Hi im " + this.get("name") + " and I'm hovered = " + this.get("hover"));
    this.toggleLampEmitMaterial();
    this.toggleHoverLights();
    this.toggleTextMaterial();
  },
  toggleHoverLights: function () {
    _.each(this.get("hoverLights"), function (light) {
      light.visible = this.get("hover");
    }, this);
  },
  setEmissiveMaterial: function (mat, r, g, b) {
    mat.emissive.r = r;
    mat.emissive.g = g;
    mat.emissive.b = b;
  },
  getLampLightMaterial: function () {
    return _.find(this.get("hoverLamps")[0].material.materials, function(item) {
        return item.name == "lampLightEmit";
    });
  },
  toggleLampEmitMaterial:function () {
    var mat = this.getLampLightMaterial();
    if (this.get("hover") === true ) {
      var lampLightRGB = utils.getColorPallete().lampLight.rgb;
      this.setEmissiveMaterial(mat, lampLightRGB.r, lampLightRGB.g, lampLightRGB.b);
    } else {
      this.setEmissiveMaterial(mat, 0, 0, 0);
    }
  },
  toggleTextMaterial: function () {
    var textMaterial = this.get("text3d").material;

    if (this.get("hover") === true ) {
      var textRGB = utils.getColorPallete().text.rgb;
      this.setEmissiveMaterial(textMaterial, textRGB.r, textRGB.g, textRGB.b );
    } else {
      this.setEmissiveMaterial(textMaterial, 0, 0, 0 );
    }
  }
});

module.exports = SceneModel;
