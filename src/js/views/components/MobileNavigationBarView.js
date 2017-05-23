import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
import navigationList from "../../data/navigationList";
import SwitchView from "../components/SwitchView";
// import utils from "../../util/utils";

var MobileNavigationBarView = BaseView.extend({
  className: "mobile-navigation-bar",
  template: _.template("<li class='hvr-sweep-to-top normal'><a ><%= displayTitle %></a><a class='css-icons<%= i %>'></a></li>"),
  events: {
    "mouseenter ul>li": "enterMenuItem",
    "mouseleave ul>li": "leaveMenuItem",
    "click ul>li": "clickme",
    "click .button-menu": "toggleSidebar",
    "click .button-home" : "resetSceneDetails",
  },
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    console.log("Init MobileNavigationBarView");
  },
  toggleSidebar: function () {
    eventController.trigger( eventController.TOGGLE_SIDEBAR_VISIBILITY);
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
    var html = "<ul class='nav-list'>";

    _.each(navigationList, function (navItem, i ) {
      html += this.template({displayTitle: navItem.name.toUpperCase(), i});
    }, this);

    return html + "</ul>";
  },
  render: function () {
    var toolbar =  $("<div class='toolbar'></div>");
        toolbar.append("<div class='button-home'></div>");
        toolbar.append(new SwitchView({}).render().el);
    var navbarBody = $("<div class='navbar-body'></div>");
        navbarBody.append("<div class='side-header'></div>");
        navbarBody.append(toolbar);
        // navbarBody.append("<hr class='toolbar-hr'>");
        navbarBody.append(this.getMenuItems());

    this.$el.append("<div class='button-menu-tab'><div class='button-menu'></div></div>");
    this.$el.append(navbarBody);
    return this;
  }
});
module.exports = MobileNavigationBarView;
