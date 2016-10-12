import eventController from "../controllers/eventController";
import BaseModel from "./BaseModel";

var SceneModel = BaseModel.extend({
  defaults: {
    "name": "Caesar_Salad",
    "object3d": null,
    "selected": false,
    "ready": true,
    "interactive": true
  },
  initialize: function( options ) {
    this.set("name", options.name);
    var object3d = options.object3d;
    object3d.name = options.name;
    this.set("object3d", object3d);
  }
});

module.exports = SceneModel;
