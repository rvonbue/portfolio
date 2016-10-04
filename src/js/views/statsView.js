import eventController from "../controllers/eventController";
import BaseView from "./BaseView";
var Stats = require("stats-js");

var AppView = BaseView.extend({
  className: "stats",
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    _.bindAll(this, "render");
    this.stats = new Stats();
    this.stats.setMode(0);
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.right = '0px';
    this.stats.domElement.style.top = '0px';
    this.stats.domElement.style.zIndex = 5;
    eventController.on(eventController.UPDATE_FACE_COUNT, this.updateFaceCount, this);
  },
  updateFaceCount: function () {

  },
  render: function () {
    this.$el.append(this.stats.domElememt);
    return this;
  }
});

module.exports = AppView;
