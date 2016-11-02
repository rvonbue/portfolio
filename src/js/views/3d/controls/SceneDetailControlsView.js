// import TWEEN from "tween.js";
// import THREE from "three";

import eventController from "../../../controllers/eventController";
import BaseView from "../../BaseView";
import SceneDetailControlsHTML from "../../html/sceneDetailControls.html";
import utils from "../../../util/utils";
var animationSpeed = utils.getAnimationSpeed().speed;

var SceneDetailControlsView = BaseView.extend({
  className: "scene-detail-controls",
  events: {
    "click .button-left": "prevInteractiveObject",
    "click .button-home": "resetSceneDetails",
    "click .button-right": "nextInteractiveObject"
  },
  initialize: function (options) {
    eventController.on(eventController.TOGGLE_SCENE_DETAILS_CONTROLS, this.show, this);
    this.height = this.$el.height() || 45;
  },
  addListeners: function () {
  },
  removeListeners: function () {
  },
  show: function (sceneModelName) {
    console.log("show");
    this.$el.attr("class", this.className + " " + sceneModelName);
    this.$el.animate({ top: this.height }, animationSpeed);
  },
  hide: function () {
    this.$el.animate({ top: 0 }, animationSpeed);
  },
  resetSceneDetails: function () {
  },
  nextInteractiveObject: function () {
    eventController.trigger(eventController.SCENE_DETAILS_SELECT_OBJECT, true);
  },
  prevInteractiveObject: function () {
    eventController.trigger(eventController.SCENE_DETAILS_SELECT_OBJECT, false);
  },
  render: function () {
    this.$el.append(SceneDetailControlsHTML);
    return this;
  }
});
module.exports = SceneDetailControlsView;
