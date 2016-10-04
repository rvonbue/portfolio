import eventController from "../controllers/eventController";
import BaseView from "./BaseView";

var NavigationBar = BaseView.extend({
  className: "navigation-bar",
  template: _.template("<li><a><%= displayTitle %></a></li>"),
  events: {
    "click li": "updateCamera"
  },
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    // _.bindAll(this, "animate", "addModelsToScene");
    var self = this;
    this.navigationItems = [
      { displayTitle: "Home", name:"home" },
      { displayTitle: "3d", name:"movieTheater" },
      { displayTitle: "Art Gallery",  name:"artGallery" }
    ]
  },
  updateCamera: function (e) {
    eventController.trigger(eventController.SWITCH_SCENE, this.navigationItems[$(e.currentTarget).index()].name);
  },
  render: function () {
    var self = this;
    this.$el.append("<div id='cssmenu'><ul>" + _.reduce(this.navigationItems, function(memo, obj){
      return memo + self.template(obj);
    }, "") + "</ul></div>");
    return this;
  }
});

module.exports = NavigationBar;
