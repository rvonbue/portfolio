import eventController from "../controllers/eventController";
import BaseView from "./BaseView";
import AppView3d from "./AppView3d";
import AppView2d from "./AppView2d";
import NavigationBar from "./components/navigationBar";
import PhotoSwipeView from "./components/PhotoSwipeView";

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
    // this.renderView2d();
    this.renderView3d();
    // this.switchViews("2d");
  },
  switchViews: function (whichView) {
    switch (whichView) {
      case "2d":
        if (this.appView3d) this.appView3d.hide();
        if (!this.appView2d) {
          this.renderView2d();
        } else {
          this.appView2d.show();
        }
        break;
      case "3d":
        if (this.appView2d) this.appView2d.hide();
        if (!this.appView3d) {
          this.renderView3d();
        } else {
          this.appView3d.show();
        }
        break;
      default:
    }
  },
  renderView2d: function () {
    this.appView2d = new AppView2d({ parentEl: this.$el });
    this.$el.append(this.appView2d.render().el);
    this.$el.addClass("twoD").removeClass("threeD");
  },
  renderView3d: function () {
    this.appView3d = new AppView3d({ parentEl: this.$el });
    this.$el.append(this.appView3d.render().el);
    this.$el.addClass("threeD").removeClass("twoD");
    this.appView3d.initScene();
  },
  render: function () {
    this.$el.append(new NavigationBar({ parentEl: this.$el }).render().el);
    this.$el.append("<div class='sky-gradient'></div>");
    var photoSwipeView = new PhotoSwipeView({ parentEl: this.$el });

    // this.$el.append(videoTag);
    return this;
  }
});

module.exports = AppView;
