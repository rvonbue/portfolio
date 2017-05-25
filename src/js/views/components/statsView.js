import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
var Stats = require("stats-js");

var StatsView = BaseView.extend({
  className: "stats",
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    _.bindAll(this, "render");
    this.stats = new Stats();
    this.faceCountEl = $("<div class='face-count'></div>");
    this.stats.setMode(0);
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.right = '0px';
    this.stats.domElement.style.top = '0px';
    this.stats.domElement.style.zIndex = 5;
    // eventController.on(eventController.UPDATE_FACE_COUNT, this.updateFaceCount, this);
    this.faceCountTotal = 0;
  },
  updateFaceCount: function (object3d) {
    // console.log("object3d", object3d);
    // if (object3d.type === "Mesh") {
    //   var groups = object3d.geometry.groups
    //   if ( groups ) {
    //     groups.forEach( function (item, i) {
    //       if (i === groups.length - 1) {
    //         this.faceCountEl.text(item.start);
    //       }
    //         console.log("item", item.start);
    //     }, this);
    //   }
    // }
  },
  render: function () {
    console.log("this.stats", this.stats);
    this.$el.append(this.stats.domElement);
    this.$el.append(this.faceCountEl);
    return this;
  }
});

module.exports = StatsView;
