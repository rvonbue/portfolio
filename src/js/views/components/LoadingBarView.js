import eventController from "../../controllers/eventController";
import loadingBarViewHTML from "../html/LoadingBarView.html";
// import utils from "../../util/utils";
// var animationSpeed = utils.getAnimationSpeed().speed;

var LoadingBarView = Backbone.View.extend({
  className: "loading-bar",
  events: {
    "click .loading-container": "toggleSize",
  },
  initialize: function (options) {
    this.addListeners();
    this.toggleEl(true);
  },
  addListeners: function () {
    eventController.on(eventController.ITEM_LOADED, this.itemLoading, this);
    eventController.on(eventController.ALL_ITEMS_LOADED, this.loadComplete, this);
    eventController.on(eventController.ITEM_START_LOAD, this.show, this);
  },
  removeListeners: function () {
  },
  toggleSize: function () {
    this.$el.toggleClass("minimize");
  },
  itemLoading: function (loaded, total) {
    var isReadyText = "READY!";
    var isLoadingText = "Loading: " + loaded + " / " + total;
    var loadingText = loaded === total ? isReadyText : isLoadingText;
    this.loadingEl.text(isLoadingText);
  },
  loadComplete: function () {
    this.$el.addClass("minimize");
    this.$el.delay(2000).fadeOut(1000);
  },
  show: function () {
    this.$el.addClass("show");
  },
  hide: function () {
    this.$el.removeClass("show");
  },
  toggleEl: function (boolEl) {
    var showHide = boolEl ? boolEl : !this.loading;
    this.loading = showHide;
  },
  render: function () {
    this.$el.append(loadingBarViewHTML);
    this.loadingEl = this.$el.find("#items-loading");
    return this;
  }
});
module.exports = LoadingBarView;
