import eventController from "../controllers/eventController";
import BaseView from "./BaseView";

var AppView2d = BaseView.extend({
  className: "appView-2d",
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    this.addListeners();
  },
  addListeners: function () {
    // eventController.on(eventController.SWITCH_VIEWS, this.switchViews, this);
  },
  removeListeners: function () {
    // eventController.off(eventController.SWITCH_VIEWS, this.switchViews, this);
  },
  show: function () {
    this.$el.show();
    this.addListeners;
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
