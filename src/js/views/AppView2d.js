import eventController from "../controllers/eventController";
import commandController from "../controllers/commandController";
import BaseView from "./BaseView";
import NavigationBar from "./components/navigationBar";

var viewArray = [
  require("./2d/WebDevView"),
  require("./2d/ThreeDAnimationView"),
  require("./2d/DigitalArtView"),
  require("./2d/DigitalArtView"),
  require("./2d/DigitalArtView")
];

var AppView2d = BaseView.extend({
  className: "appView-2d",
  parentClass: "twoD",
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    this.parentEl = options.parentEl;
    this.bodyEl = $("<div class='view-body-2d'></div>");
    this.setSection(this.getSectionView());
  },
  addListeners: function () {
    console.log("addListeners:AppView2d");
    eventController.on(eventController.SWITCH_PAGE , this.switchPage, this);
  },
  removeListeners: function () {
    console.log("removeListeners:AppView2d");
    eventController.off(eventController.SWITCH_PAGE , this.switchPage, this);
  },
  getSectionView: function () {
    return commandController.request(commandController.GET_SELECTED_SECTION);
  },
  setSection: function (index) {
    index = index ? index : 0;
    this.currentView = new viewArray[index];
    this.bodyEl.append(this.currentView.render().el);
  },
  switchPage: function (index) {
    this.currentView.close();
    this.setSection(index);
  },
  render: function () {
    var navigationBar = new NavigationBar({ parentEl: this.$el });
    this.childViews.push(navigationBar);
    this.$el.append(navigationBar.render().el);
    this.$el.append(this.bodyEl);
    return this;
  }
});

module.exports = AppView2d;
