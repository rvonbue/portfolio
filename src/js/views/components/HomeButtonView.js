import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
// import utils from "../../util/utils";

var HomeButtonView = BaseView.extend({
  className: "home-button-container",
  events: {
    "click .button-home": "resetSceneDetails",
  },
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
  },
  resetSceneDetails: function () {
    eventController.trigger(eventController.RESET_SCENE);
  },
  render: function () {
    this.$el.append("<div class='button-home'></div>");
    return this;
  }
});
module.exports = HomeButtonView;
