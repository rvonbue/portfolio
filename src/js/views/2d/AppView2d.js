import eventController from "../../controllers/eventController";
import commandController from "../../controllers/commandController";
import BaseView from "../BaseView";
var htmlPageNavigation = [
  require("html!./home.html"),
  require("html!./web_dev.html")
];

var AppView2d = BaseView.extend({
  className: "appView-2d",
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    this.addListeners();
    this.bodyEl = $("<div class='view-body-2d'></div>");
    this.setSection();
  },
  addListeners: function () {
    eventController.on(eventController.SWITCH_PAGE , this.switchPage, this);
  },
  removeListeners: function () {
    eventController.off(eventController.SWITCH_PAGE , this.switchPage, this);
  },
  setSection: function () {
    this.bodyEl.append(htmlPageNavigation[0]);
  },
  switchPage: function (index) {
    if (!index) index = commandController.request(commandController.GET_SELECTED_SECTION);
    console.log("switchPage:", index);
    this.bodyEl.empty();
    this.bodyEl.append(htmlPageNavigation[index]);
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
    this.$el.append(this.bodyEl);
    return this;
  }
});

module.exports = AppView2d;
