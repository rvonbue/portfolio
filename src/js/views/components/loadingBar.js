// import TWEEN from "tween.js";
// import THREE from "three";

import eventController from "../../../controllers/eventController";
import BaseView from "../../BaseView";
import SceneDetailControlsHTML from "../../html/LoadingBarView.html";
import utils from "../../../util/utils";
var animationSpeed = utils.getAnimationSpeed().speed;

var LoadingBarView = BaseView.extend({
  className: "loading-bar",
  events: {
    "click .button-left": "prevInteractiveObject",
    "click .button-home": "resetSceneDetails",
    "click .button-right": "nextInteractiveObject"
  },
  initialize: function (options) {
    eventController.on(eventController.TOGGLE_SCENE_DETAILS_CONTROLS, this.show, this);
    this.height = this.$el.height() || 45;
    this.show("video-controls");
  },
  addListeners: function () {
  },
  removeListeners: function () {
  },
  render: function () {
    this.$el.append(SceneDetailControlsHTML);
    return this;
  }
});
module.exports = LoadingBarView;
