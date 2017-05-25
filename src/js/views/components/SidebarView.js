import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
import navigationList from "../../data/navigationList";
import SwitchView from "../components/SwitchView";
import DatGuiView from "../3d/DatGuiView";
// import utils from "../../util/utils";

var SidebarView = BaseView.extend({
  className: "sidebar",
  template: _.template("<li class='hvr-sweep-to-top normal'><a ><%= displayTitle %></a><a class='css-icons<%= i %>'></a></li>"),
  events: {
    "mouseenter ul.nav-list>li": "enterMenuItem",
    "mouseleave ul.nav-list>li": "leaveMenuItem",
    "click ul.nav-list>li": "clickme",
    "click .button-menu": "toggleSidebar",
    "click .button-home" : "showNavList",
    "click .button-settings": "show3dSettings",
    "click .sidebar-click-catcher": "toggleSidebar"
  },
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);

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
  showNavList: function (evt) {
    var el = $(evt.currentTarget);
    this.swapSelectedSubmenu(el);
    eventController.trigger(eventController.RESET_SCENE);
  },
  show3dSettings: function (evt) {
    var el = $(evt.currentTarget);
    this.swapSelectedSubmenu(el);
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
    var index = currentTargetEl.index();
    this.navbarBodyContainerEl.find(".show:first").removeClass("show");
    this.navbarBodyContainerEl.children().eq(index).addClass("show");
    // console.log("swapSelectedSubmenu", this.navbarBodyContainerEl.children().eq(index));
  },
  showHideSubmenu: function () {

  },
  getMenuItemsHTML: function () {
    var html = "<div class='show'><ul class='nav-list'>";

    _.each(navigationList, function (navItem, i ) {
      html += this.template({displayTitle: navItem.name.toUpperCase(), i});
    }, this);

    return html + "</ul></div>";
  },
  getSidebarClickCatchHTML: function () {
    return "<div class='sidebar-click-catcher'></div>";
  },
  addDatGui: function () {
    var datGui = new DatGuiView();
        datGui.render();
    return datGui;
  },
  render: function () {
    this.toolbarEl =  $("<div class='toolbar'></div>");
    this.toolbarEl.append("<div class='button-home active'></div>");
    this.toolbarEl.append("<div class='button-settings'></div>");
    this.toolbarEl.append(new SwitchView({}).render().el);
    this.datGui = this.addDatGui();

    this.navbarBodyContainerEl = $("<div class='navbar-body-container'></div>");
    this.navbarBodyContainerEl.append(this.getMenuItemsHTML());
    this.navbarBodyContainerEl.append(this.datGui.$el);

    var sidebarHeader = $("<div class='side-header'></div>");
        sidebarHeader.append("<img class='side-header-img' src='/images/small-header.png'/>");

    var navbarBody = $("<div class='navbar-body'></div>");
        navbarBody.append(sidebarHeader);
        navbarBody.append(this.toolbarEl);
        navbarBody.append(this.navbarBodyContainerEl);

    this.$el.append("<div class='button-menu-tab'><div class='button-menu'></div></div>");
    this.$el.append(navbarBody);
    this.$el.append(this.getSidebarClickCatchHTML());

    return this;
  }
});
module.exports = SidebarView;
