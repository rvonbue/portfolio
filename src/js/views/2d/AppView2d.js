import eventController from "../../controllers/eventController";
import commandController from "../../controllers/commandController";
import BaseView from "../BaseView";
import WebDevView2d from "./WebDevView";
var viewArray = [
  WebDevView2d,
];

var AppView2d = BaseView.extend({
  className: "appView-2d",
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    this.addListeners();
    this.bodyEl = $("<div class='view-body-2d'></div>");
    this.setSection(0);
  },
  addListeners: function () {
    eventController.on(eventController.SWITCH_PAGE , this.switchPage, this);
  },
  removeListeners: function () {
    eventController.off(eventController.SWITCH_PAGE , this.switchPage, this);
  },
  getSectionView: function () {

  },
  setSection: function (index) {
    var newView = new viewArray[index];
    this.bodyEl.append(newView.render().el);
  },
  switchPage: function (index) {
    if (!index) index = commandController.request(commandController.GET_SELECTED_SECTION);
    this.bodyEl.empty().append(new viewArray[index].render().el);
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
