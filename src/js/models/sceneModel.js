import eventController from "../controllers/eventController";
import BaseModel from "./BaseModel";

var SceneModel = Backbone.Model.extend({
  defaults: {
    "name": "Caesar_Salad",
    "object3d": null,
    "selected": false,
    "ready": true,
    "interactive": true,
    "size": { width: 0, height: 0 },
    "position": {x: 0, y: 0 }
  },
  initialize: function( options ) {
    this.set("name", options.name);
    options.object3d.name = options.name;
    this.set("object3d", options.object3d);
    this.setSize();
    this.addModelListeners();
  },
  getPosition: function () {

  },
  getSize: function () {
    var object3d = this.get("object3d");
    var height = Math.abs(object3d.geometry.boundingBox.max.y) + Math.abs(object3d.geometry.boundingBox.min.y);
    var width = Math.abs(object3d.geometry.boundingBox.max.x) + Math.abs(object3d.geometry.boundingBox.min.x);
    var length = Math.abs(object3d.geometry.boundingBox.max.z) + Math.abs(object3d.geometry.boundingBox.min.z);
    return { w: width, h: height, l: length };
  },
  setPosition: function () {

  },
  setSize: function () {
    var object3d = this.get("object3d");
    object3d.geometry.boundingBox.max.y
  },
  addModelListeners: function () {
    this.on("change:selected", this.onChangeSelectedListeners);
  },
  onChangeSelectedListeners: function () {
    console.log("HI IM " + this.get("name") + " and I'm selected = " + this.get("selected"));
    console.log("Here is my Object:", this.get("object3d"));
    // this.get("object3d").visible = this.get("selected");
  }
});

module.exports = SceneModel;
