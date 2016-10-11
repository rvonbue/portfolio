import eventController from "../controllers/eventController";
import BaseView from "./BaseView";
import NavigationBar from "../views/navigationBar";
import Appview3d from "./AppView3d";

var AppView = BaseView.extend({
  className: "appview-container",
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
  },
  addListeners: function () {
    // $(window).resize(this.resize);
  },
  initScene: function () {
    this.appView3d = new Appview3d();
    this.$el.append(this.appView3d.render().el);
    this.appView3d.initScene();
  },
  switchViews: function () {
    
  },
  render: function () {
    this.$el.append(new NavigationBar().render().el);
    return this;
  }
});

module.exports = AppView;
