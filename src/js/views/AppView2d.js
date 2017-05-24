import eventController from "../controllers/eventController";
import commandController from "../controllers/commandController";
import BaseView from "./BaseView";
import NavigationBar2d from "./components/NavigationBar2d";

var viewArray = [
  require("./2d/WebDevView"),
  require("./2d/ThreeDAnimationView"),
  require("./2d/DigitalArtView"),
  require("./2d/AboutMeView"),
  require("./2d/ContactView")
];

var AppView2d = BaseView.extend({
  className: "appView-2d",
  parentClass: "twoD",
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    this.parentEl = options.parentEl;
    this.bodyEl = $("<div class='view-body-2d'></div>");
    this.currentViewIndex = null;
    this.addListeners();

    viewArray.forEach( function (view, i) {
      this.childViews.push({ view: null });
    }, this);

    this.setSection(this.getSectionView());
  },
  addListeners: function () {
    eventController.on(eventController.SWITCH_PAGE , this.switchPage, this);
  },
  removeListeners: function () {
    eventController.off(eventController.SWITCH_PAGE , this.switchPage, this);
  },
  getSectionView: function () {
    return commandController.request(commandController.GET_SELECTED_SECTION);
  },
  setSection: function (index) {
    index = index ? index : 0;

    if (this.childViews[index].view === null ) {
      var new2dView = new viewArray[index];
      this.childViews[index].view = new2dView;
      this.bodyEl.append(new2dView.render().el);
      new2dView.show();
    } else {
      this.childViews[index].view.show();
    }
    this.currentViewIndex = index;
  },
  switchPage: function (index) {
    if ( this.currentViewIndex === index) return;
    this.childViews[this.currentViewIndex].view.hide();
    this.setSection(index);
  },
  render: function () {
    var navigationBar2d = new NavigationBar2d({ parentEl: this.$el });
    this.childViews.push(navigationBar2d);
    this.$el.append("<div class='img-header'><img src='/images/big-header.png'/></div>");
    this.$el.append(navigationBar2d.render().el);
    this.$el.append(this.bodyEl);
    return this;
  }
});

module.exports = AppView2d;
