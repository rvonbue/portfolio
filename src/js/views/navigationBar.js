import eventController from "../controllers/eventController";
import BaseView from "./BaseView";
import navigationList from "../data/navigationList";

var NavigationBar = BaseView.extend({
  className: "navigation-bar",
  template: _.template("<li><a><%= displayTitle %></a></li>"),
  events: {
    "click li": "updateCamera"
  },
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    this.height = 45;
  },
  updateCamera: function (e) {
    eventController.trigger(eventController.SWITCH_SCENE, this.navigationItems[$(e.currentTarget).index()].name);
  },
  render: function () {
    var self = this;
    var cssMenu = "<div id='cssmenu'><ul>";

    _.each(navigationList, function(memo){
      cssMenu += self.template({displayTitle: memo});
    });

    cssMenu += "</ul></div>";
    this.$el.append(cssMenu);

    return this;
  }
});

module.exports = NavigationBar;
