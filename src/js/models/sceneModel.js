import eventController from "../controllers/eventController";
import BaseModel from "./BaseModel";

var SceneModel = BaseModel.extend({
  defaults: {
    "name": "Caesar_Salad",
    "object3d": null,
    "selected": false,
    "ready": true
  },
  initialize: function( options ) {
    this.set("name", options.name);
    if (options.object3d) { this.set("object3d", options.object3d); }
  }
});

module.exports = SceneModel;
