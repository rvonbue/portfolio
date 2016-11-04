// import TWEEN from "tween.js";
// import THREE from "three";

import eventController from "../../../controllers/eventController";
import BaseView from "../../BaseView";
import SceneDetailControlsHTML from "../../html/sceneDetailControls.html";
import utils from "../../../util/utils";
var animationSpeed = utils.getAnimationSpeed().speed;

var SceneDetailControlsView = BaseView.extend({
  className: "scene-detail-controls",
  visible: false,
  events: {
    "click .button-left": "prevInteractiveObject",
    "click .button-home": "resetSceneDetails",
    "click .button-right": "nextInteractiveObject"
  },
  initialize: function (options) {
    eventController.on(eventController.TOGGLE_SCENE_DETAILS_CONTROLS, this.show, this);
    eventController.on(eventController.ITEM_LOADED, this.itemLoading, this);
    eventController.on(eventController.ALL_ITEMS_LOADED, this.hideLoading, this);
    eventController.on(eventController.ITEM_START_LOAD, this.showLoading, this);
    this.navBarHeight = 45;
    this.showLoading();
  },
  addListeners: function () {
  },
  removeListeners: function () {
  },
  itemLoading: function (loaded, total) {
    if (!this.visible) this.show("loading");
    var loadingText;

    if (loaded === total ) {
      loadingText = "Models...";
    } else {
      loadingText = loaded + " / " + total;
    }

    this.loadingEl.text(loadingText);
  },
  showLoading: function () {
    this.show("loading");
    this.loading = true;
  },
  hideLoading: function () {
    this.hide("loading");
    this.loading = false;
  },
  show: function (sceneModelClassName) {
    this.$el.attr("class", this.getNewClasses(sceneModelClassName));
    // this.$el.animate({ top: this.navBarHeight }, 0).show();
    this.$el.css("top", this.navBarHeight ).show();
    this.visible= true;
  },
  hide: function (className) {
    this.$el.removeClass(className);
    var shouldHide = this.$el[0].classList.length <= 1;
    if (shouldHide) {
      // this.$el.animate({ top: -80 }, 0).hide();
      this.$el.css("top", -80 ).hide();
      this.visible= false;
    }
  },
  getNewClasses: function (sceneModelClassName) {
    var loading = this.loading ? " loading " : " ";
    return this.className + loading + sceneModelClassName;
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
