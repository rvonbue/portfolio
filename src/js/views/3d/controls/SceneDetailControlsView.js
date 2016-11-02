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
    eventController.on(eventController.ITEM_LOADED, this.itemLoading, this);
    this.navBarHeight = 45;
    this.show("loading");
  },
  addListeners: function () {
  },
  removeListeners: function () {
  },
  setHeight:function () {

  },
  itemLoading: function (loaded, total) {
    if (loaded === total) this.hide();
    var loadingText = loaded + " / " + total;
    this.loadingEl.text(loadingText);
  },
  // showLoading: function () {
  //   this.$el.attr("class", this.className + " loading");
  //   var halfHeight = 100 / 2 ;
  //   console.log("height", window.innerHeight);
  //   this.$el.animate({ top: window.innerHeight / 2 - halfHeight }, animationSpeed).show();
  // },
  // hideLoading: function () {
  //   this.hide();
  // },
  show: function (sceneModelClassName) {
    this.$el.attr("class", this.className + " " + sceneModelClassName);
    this.$el.animate({ top: this.navBarHeight }, animationSpeed).show();
  },
  hide: function () {
    this.$el.animate({ top: -80 }, animationSpeed).hide(animationSpeed);
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
    this.loadingEl = this.$el.find("#items-loading");
    return this;
  }
});
module.exports = SceneDetailControlsView;
