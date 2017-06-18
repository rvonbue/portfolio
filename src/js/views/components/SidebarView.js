import eventController from "../../controllers/eventController";
import commandController from "../../controllers/commandController";
import BaseView from "../BaseView";
import navigationList from "../../data/navigationList";
import SwitchView from "../components/SwitchView";
import DatGuiView from "../3d/DatGuiView";

import sidebarHtml from "../html/sidebarHtml/sidebarHeader.html";
import toolbarHtml from "../html/sidebarHtml/toolbar.html";

var viewArray = [
  require("../2d/WebDevView"),
  require("../2d/ThreeDAnimationView"),
  require("../2d/DigitalArtView"),
  require("../2d/AboutMeView"),
  require("../2d/ContactView")
];

var SidebarView = BaseView.extend({
  className: "sidebar",
  template: _.template("<li class='hvr-sweep-to-top normal'><a ><%= displayTitle %></a><a class='css-icons<%= i %>'></a></li>"),
  events: {
    "mouseenter ul.nav-list>li": "enterMenuItem",
    "mouseleave ul.nav-list>li": "leaveMenuItem",
    "click ul.nav-list>li": "clickme",
    "click .button-menu": "toggleSidebar",
    "click .button-home": "showNavList",
    "click .button-list, .button-settings": "clickToolbar",
    "click .sidebar-click-catcher": "toggleSidebar"
  },
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    eventController.on(eventController.LOAD_SIDEBAR_CONTENT, this.loadSidebarContent, this);
    eventController.on(eventController.ON_RESIZE, this.setHeight, this);
  },
  setHeight: function (size) {
    var total = size.h - this.navbarBodyContainerEl.offset().top;
    this.navbarBodyContainerEl.css("height", total +'px');
  },
  toggleSidebar: function (showSidebar) {
    if (showSidebar && showSidebar == true) {
        this.$el.parent().removeClass("sidebar-hide");
    } else {
      this.$el.parent().toggleClass("sidebar-hide");
    }
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
  showNavList: function (evt) {
    this.clickToolbar(evt);
    eventController.trigger(eventController.RESET_SCENE);
  },
  clickToolbar: function (evt) {
    this.swapSelectedSubmenu($(evt.currentTarget));
  },
  enterHoverNavigationLi: function (index) {
    eventController.trigger(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR, navigationList[index] , true );
  },
  leaveHoverNavigationLi: function () {
    eventController.trigger(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR);
  },
  swapSelectedSubmenu: function (currentTargetEl) {
    this.toolbarEl.find(".active:first").removeClass("active");
    currentTargetEl.addClass("active");
    this.navbarBodyContainerEl.find(".show:first").removeClass("show");
    this.navbarBodyContainerEl.children().eq(currentTargetEl.index()).addClass("show");
  },
  loadSidebarContent: function (whichPage) {
    this.toggleSidebar(true);
    this.$el.find(".button-list:first").click();

    var self = this;
    _.each(navigationList, function (obj, i ) {
      if (obj.name == whichPage) {
        var view2d = new viewArray[i];
        self.view2dSidebarEl.empty().append(view2d.render().el);
        view2d.$el.show();
        return;
      }
    });

  },
  getMenuItemsHTML: function () {
    var html = "<div class='nav-list-container show'><ul class='nav-list'>";

    _.each(navigationList, function (navItem, i ) {
      html += this.template({displayTitle: navItem.name.toUpperCase(), i});
    }, this);

    return html + "</ul></div>";
  },
  getSidebarClickCatchHTML: function () {
    return "<div class='sidebar-click-catcher'></div>";
  },
  render: function () {
    this.datGui = new DatGuiView().render();
    this.view2dSidebarEl = $("<div class='view2d-sidebar'></div>");

    this.navbarBodyContainerEl = $("<div class='navbar-body-container'></div>")
    .append(this.getMenuItemsHTML())
    .append(this.view2dSidebarEl)
    .append(this.datGui.$el);

    var navbarBody = $("<div class='navbar-body'></div>");
        navbarBody.append(sidebarHtml)
                  .append(toolbarHtml)
                  .append(this.navbarBodyContainerEl);

    this.toolbarEl = navbarBody.find(".toolbar:first").append(new SwitchView({}).render().el);

    this.$el.append("<div class='button-menu-tab'><div class='button-menu'></div></div>")
            .append(navbarBody)
            .append(this.getSidebarClickCatchHTML());

    return this;
  }
});
module.exports = SidebarView;
