import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
import navigationList from "../../data/navigationList";
// import utils from "../../util/utils";

var NavigationBarView3d = BaseView.extend({
  className: "home-button-container",
  template: _.template("<li><a class='hvr-sweep-to-top normal'><%= displayTitle %></a><a class='css-icons<%= i %>'></a></li>"),
  events: {
    "dblclick" : "resetSceneDetails",
    "mouseenter ul>li": "enterMenuItem",
    "mouseleave ul>li": "leaveMenuItem",
    "click ul>li": "clickme"
  },
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
  },
  enterMenuItem: function (evt) {
    this.enterHoverNavigationLi( $(evt.currentTarget).index() );
  },
  leaveMenuItem: function (evt) {
    this.leaveHoverNavigationLi( $(evt.currentTarget).index() );
  },
  clickme: function (evt) {
    eventController.trigger(eventController.SWITCH_PAGE, $(evt.currentTarget).closest("li").index() );
  },
  resetSceneDetails: function () {
    eventController.trigger(eventController.RESET_SCENE);
  },
  enterHoverNavigationLi: function (index) {
    eventController.trigger(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR, navigationList[index] , true );
  },
  leaveHoverNavigationLi: function () {
    eventController.trigger(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR);
  },
  getMenuItems: function () {
    var html = "<ul>";

    _.each(navigationList, function (navItem, i ) {
      html += this.template({displayTitle: navItem.name.toUpperCase(), i});
    }, this);

    return html + "</ul>";
  },
  render: function () {
    this.$el.append(this.getMenuItems());
    return this;
  }
});
module.exports = NavigationBarView3d;
