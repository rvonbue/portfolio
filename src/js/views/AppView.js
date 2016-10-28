import eventController from "../controllers/eventController";
import BaseView from "./BaseView";
import NavigationBar from "../views/navigationBar";
import AppView3d from "./3d/AppView3d";
import AppView2d from "./2d/AppView2d";

var AppView = BaseView.extend({
  className: "appview-container",
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    this.addListeners();
  },
  addListeners: function () {
    eventController.on(eventController.SWITCH_VIEWS, this.switchViews, this);
  },
  initScene: function () {
    this.renderView2d();
    this.renderView3d();
    this.switchViews("2d");
  },
  switchViews: function (whichView) {
    switch (whichView) {
      case "2d":
        if (this.appView3d) this.appView3d.hide(this.$el);
        if (!this.appView2d) {
          this.renderView2d();
        } else {
          this.appView2d.show(this.$el);
        }
        break;
      case "3d":
        if (this.appView2d) this.appView2d.hide(this.$el);
        if (!this.appView3d) {
          this.renderView3d();
        } else {
          this.appView3d.show(this.$el);
        }
        break;
      default:
    }
  },
  renderView2d: function () {
    this.appView2d = new AppView2d();
    this.$el.append(this.appView2d.render().el);
    this.$el.addClass("twoD").removeClass("threeD");
  },
  renderView3d: function () {
    this.appView3d = new AppView3d();
    this.$el.append(this.appView3d.render().el);
    this.$el.addClass("threeD").removeClass("twoD");
    this.appView3d.initScene();
  },
  render: function () {
    this.$el.append(new NavigationBar().render().el);
    this.$el.append("<div class='sky-gradient'></div>");
    return this;
  }
});

module.exports = AppView;
