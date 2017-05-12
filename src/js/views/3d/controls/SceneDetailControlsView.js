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
    "click .button-right": "nextInteractiveObject",

    "click .button-pause": "clickPause",
    "click .button-play": "clickPlay",
    "click .button-skip-next": "clickSkipNext",
  },
  initialize: function (options) {
    this.addListeners();
    this.navBarHeight = 45;
  },
  addListeners: function () {
    eventController.on(eventController.TOGGLE_SCENE_DETAILS_CONTROLS, this.show, this);
    eventController.on(eventController.VIDEO_PLAY_PAUSE, this.togglePlayPause, this);
  },
  removeListeners: function () {
    eventController.off(eventController.TOGGLE_SCENE_DETAILS_CONTROLS, this.show, this);
    eventController.off(eventController.VIDEO_PLAY_PAUSE, this.togglePlayPause, this);
  },
  show: function (sceneModelClassName) {
    this.$el.attr("class", this.getNewClasses(sceneModelClassName));
    this.$el.show();
    this.visible= true;
  },
  hide: function (className) {
    this.$el.removeClass(className);
    var shouldHide = this.$el[0].classList.length <= 1;
    if (shouldHide) this.visible= false;
  },
  getNewClasses: function (sceneModelClassName) {
    var loading = this.loading ? " loading " : " ";
    if (sceneModelClassName === "loading") {
      return this.$el[0].classList.value + loading;
    }
    return (this.className + loading + sceneModelClassName);
  },
  resetSceneDetails: function () {
    eventController.trigger(eventController.RESET_SCENE);
  },
  nextInteractiveObject: function () {
    eventController.trigger(eventController.SCENE_DETAILS_SELECT_OBJECT, true);
  },
  prevInteractiveObject: function () {
    eventController.trigger(eventController.SCENE_DETAILS_SELECT_OBJECT, false);
  },
  togglePlayPause: function (playPauseBool) {
    this.playEl.toggleClass("hide");
    this.pauseEl.toggleClass("hide");
  },
  clickPause: function () {
    eventController.trigger(eventController.VIDEO_PLAY_PAUSE, false);
  },
  clickPlay: function () {
    eventController.trigger(eventController.VIDEO_PLAY_PAUSE, true);
  },
  render: function () {
    this.$el.append(SceneDetailControlsHTML);
    this.playEl = this.$el.find(".button-play:first");
    this.pauseEl = this.$el.find(".button-pause:first");
    this.show("slide-controls");
    return this;
  }
});
module.exports = SceneDetailControlsView;
