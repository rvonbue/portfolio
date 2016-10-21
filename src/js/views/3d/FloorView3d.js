import Base3dView from "./Base3dView";
import eventController from "../../controllers/eventController";
import data from "../../data/roboto_regular.json";
import utils from "../../util/utils";
import THREE from "three";

var FloorView3d = Base3dView.extend({
  name: "home",
  initialize: function () {
    Base3dView.prototype.initialize.apply(this, arguments);
    // _.bindAll(this, "addText");
    console.log("init FloorView3d", this);
  },

});

module.exports = FloorView3d;
