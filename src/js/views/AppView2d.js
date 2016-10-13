import eventController from "../controllers/eventController";
import commandController from "../controllers/commandController";
import BaseView from "./BaseView";
var htmlPageNavigation = [
  require("html!./2d/home.html"),
  require("html!./2d/web_dev.html")
]

var AppView2d = BaseView.extend({
  className: "appView-2d",
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    this.addListeners();
    this.setSection();
  },
  addListeners: function () {
    eventController.on(eventController.SWITCH_SCENE , this.switchPage, this);
  },
  removeListeners: function () {
    eventController.off(eventController.SWITCH_SCENE , this.switchPage, this);
  },
  setSection: function () {
    this.$el.append(htmlPageNavigation[0]);
  },
  switchPage: function (index) {

    if (!index) index = commandController.request(commandController.GET_SELECTED_SECTION);
    console.log("switchPage:", index);
    this.$el.empty();
    this.$el.append(htmlPageNavigation[index]);
  },
  show: function (parentEl) {
    this.$el.show();
    this.addListeners();
    parentEl.addClass("twoD");
  },
  hide: function (parentEl) {
    this.$el.hide();
    this.removeListeners();
    parentEl.removeClass("twoD");
  },
  render: function () {
    // this.$el.
    return this;
  }
});

module.exports = AppView2d;
