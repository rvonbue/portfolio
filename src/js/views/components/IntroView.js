import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
import html from "../html/introView.html";

var SwitchView = BaseView.extend({
  className: "intro-view",
  events: {
    // "click #myonoffswitch": "clickSwitchViews",
    "click .intro-switch-2d": "switchView2d",
    "click .intro-switch-3d": "switchView3d",
  },
  initialize: function () {
    var self = this;
    BaseView.prototype.initialize.apply(this, arguments);
    eventController.once(eventController.SWITCH_VIEWS, function () {
      self.destroy();
    });
  },
  switchView2d: function () {
    eventController.trigger(eventController.SWITCH_VIEWS, "2d");
  },
  switchView3d: function () {
    eventController.trigger(eventController.SWITCH_VIEWS, "3d");
  },
  destroy: function () {
    this.undelegateEvents();
    this.$el.removeData().unbind();
    this.remove();
  },
  render: function () {
    this.$el.append(html);
    return this;
  }
});

module.exports = SwitchView;
