import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
import switchViewHtml from "../html/switchView.html";

var SwitchView = BaseView.extend({
  className: "switch-views",
  events: {
    "click #myonoffswitch": "clickSwitchViews",
    // "click .switch-2d": "switchView2d",
    // "click .switch-3d": "switchView3d",
  },
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);

  },
  clickSwitchViews: function (evt) {
    var isChecked = this.$el.find("input:checked").length > 0 ? true : false;
    if ( isChecked ) {
      this.switchView3d();
    } else {
      this.switchView2d();
    }
  },
  switchView2d: function () {
    eventController.trigger(eventController.SWITCH_VIEWS, "2d");
  },
  switchView3d: function () {
    eventController.trigger(eventController.SWITCH_VIEWS, "3d");
    eventController.trigger(eventController.RESET_SCENE, "3d");
  },
  render: function () {
    this.$el.append(switchViewHtml);
    return this;
  }
});

module.exports = SwitchView;
