import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
import switchViewHtml from "../html/switchView.html";

var SwitchView = BaseView.extend({
  className: "switch-views",
  events: {
    "click #myonoffswitch": "clickSwitchViews",
  },
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    eventController.on(eventController.SET_VIEW, this.updateCheckBox, this);
    // eventController.on(eventController.SWITCH_VIEWS, this.updateCheckBox, this);
  },
  clickSwitchViews: function (evt) {
    if ( this.getIsChecked() ) {
      this.switchView3d();
    } else {
      this.switchView2d();
    }
  },
  getIsChecked: function () {
    return this.$el.find("input:checked").length > 0 ? true : false;
  },
  switchView2d: function () {
    eventController.trigger(eventController.SWITCH_VIEWS, "2d");
  },
  switchView3d: function () {
    eventController.trigger(eventController.SWITCH_VIEWS, "3d");
    eventController.trigger(eventController.RESET_SCENE, "3d");
  },
  updateCheckBox: function (whichView) { // isChecked means 3d view
    var isChecked = this.getIsChecked();

    if (whichView === "2d" && isChecked === true) {
      this.$el.find("input:first").click();
    } else if (whichView === "3d" && isChecked !== true) {
      this.$el.find("input:first").click();
    } else {
      eventController.trigger(eventController.SWITCH_VIEWS, whichView);
    }
  },
  render: function () {
    this.$el.append(switchViewHtml);
    return this;
  }
});

module.exports = SwitchView;
