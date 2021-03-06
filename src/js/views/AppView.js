import eventController from "../controllers/eventController";
import BaseView from "./BaseView";
import AppView3d from "./AppView3d";
import AppView2d from "./AppView2d";
import SidebarView from "./components/SidebarView";
import PhotoSwipeView from "./components/PhotoSwipeView";
// import SwitchView from "./components/SwitchView";
import IntroView from "./components/IntroView";

import utils from "../util/utils";

var AppView = BaseView.extend({
  className: "appview-container sidebar-hide",
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    this.addListeners();
  },
  addListeners: function () {
    eventController.on(eventController.SWITCH_VIEWS, this.switchViews, this);
  },
  initScene: function () {
    var startView = null;
    if (localStorage) startView = localStorage.getItem('startView');

    if ( startView ) {
      eventController.trigger(eventController.SET_VIEW, startView);
    } else  {
      this.$el.addClass("intro-view-open");
      this.$el.append(new IntroView({ parentEl: this.$el }).render().el);
    }
  },
  switchViews: function (whichView) {
    if (whichView === "2d") {
      if ( this.appView3d ) this.appView3d.hide();
      if ( !this.appView2d ) { this.renderView2d(); }
      else { this.appView2d.show(); }
    } else if (whichView === "3d") {
      if ( this.appView2d ) this.appView2d.hide();
      if ( !this.appView3d ) { this.renderView3d(); }
      else  { this.appView3d.show(); }
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
  getSkyGradientHTML: function () {
    var startSkyColor = utils.getWorldLighting().background.cssSkyGradient;
    var skyGradientDiv = "<div class='sky-gradient sky-gradient-" + startSkyColor + "'></div>";
    return skyGradientDiv;
  },
  render: function () {
    var photoSwipeView = new PhotoSwipeView({ parentEl: this.$el });
    this.$el.append( new SidebarView().render().el);
    this.$el.append(this.getSkyGradientHTML());
    return this;
  }
});

module.exports = AppView;
