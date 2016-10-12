import eventController from "../controllers/eventController";
import commandController from "../controllers/commandController";
import BaseView from "./BaseView";
var home =  require("html!./2d/home.html");

var AppView2d = BaseView.extend({
  className: "appView-2d",
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    this.addListeners();
    this.selectedSection = commandController.request(commandController.GET_SELECTED_SECTION);
    this.setSection();
  },
  addListeners: function () {
    eventController.on(eventController.SWITCH_VIEWS, this.switchViews, this);
  },
  removeListeners: function () {
    eventController.off(eventController.SWITCH_VIEWS, this.switchViews, this);
  },
  setSection: function () {
    this.$el.append(home);
  },
  switchPage: function () {

  },
  show: function () {
    this.$el.show();
    this.addListeners();
  },
  hide: function () {
    this.$el.hide();
    this.removeListeners();
  },
  render: function () {
    return this;
  }
});

module.exports = AppView2d;
