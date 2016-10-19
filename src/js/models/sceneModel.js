import eventController from "../controllers/eventController";
import BaseModel from "./BaseModel";

var SceneModel = Backbone.Model.extend({
  defaults: {
    "name": "Caesar_Salad",
    "object3d": null,
    "selected": false,
    "ready": true,
    "interactive": true,
  },
  initialize: function( options ) {
    this.set("name", options.name);
    options.object3d.name = options.name;
    this.set("object3d", options.object3d);
    this.addModelListeners();
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
