import eventController from "../controllers/eventController";
import commandController from "../controllers/commandController";
import BaseView from "./BaseView";
import navigationList from "../data/navigationList";

var NavigationBar = BaseView.extend({
  className: "navigation-bar",
  template: _.template("<li><a><%= displayTitle %></a></li>"),
  events: {
    "click li": "clickSelected",
    "click .2d": "switchView2d",
    "click .3d": "switchView3d"
  },
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    _.bindAll(this, "getSelectedSection");
    this.height = 45;
    this.addListeners();
  },
  addListeners: function () {
    eventController.on(eventController.HOVER_NAVIGATION, this.updateNavigation, this);
    commandController.reply(commandController.GET_SELECTED_SECTION, this.getSelectedSection);
  },
  cacheListEls: function () {
    var navEljq = this.$el.find("li");
    this.navEls = {};
    _.each(navigationList, function (name, i) {
      this.navEls[name] = $(navEljq[i]);
    }, this);
  },
  getSelectedSection: function () {
    if (this.selectedEl) return navigationList[this.selectedEl.index()];
    return navigationList[0];
  },
  updateNavigation: function (closestObject) {
    if (this.selectedEl && closestObject ) {
      this.swapSelectedEl(this.navEls[closestObject.object.name]);
    } else if (this.selectedEl) {
      this.selectedEl.removeClass("selected");
      this.selectedEl = null;
    } else if (closestObject) {
      this.selectedEl = this.navEls[closestObject.object.name].addClass("selected");
    }
  },
  swapSelectedEl: function (newSelectedEl) {
    if (!newSelectedEl) return;
    if (this.selectedEl) this.selectedEl.removeClass("selected");
    this.selectedEl = newSelectedEl.addClass("selected");
  },
  clickSelected: function (e) {
    var currentTarget = $(e.currentTarget);
    this.swapSelectedEl(currentTarget);

    eventController.trigger(eventController.SWITCH_SCENE, navigationList[currentTarget.index()].name);
  },
  switchView2d: function () {
    eventController.trigger(eventController.SWITCH_VIEWS, "2d");
  },
  switchView3d: function (what) {
    eventController.trigger(eventController.SWITCH_VIEWS, "3d");
  },
  render: function () {
    var cssMenu = "<div id='cssmenu'><ul>";

    _.each(navigationList, function(title){
      cssMenu += this.template({displayTitle: title.toUpperCase()});
    }, this);

    cssMenu += "</ul></div>";
    this.$el.append(cssMenu);
    this.$el.append("<div class='switch-views'><div class='2d'><a href='javascript:;'>2d</a></div><div class='3d'><a href='javascript:;'>3d</a></div></div>");
    this.cacheListEls();

    return this;
  }
});

module.exports = NavigationBar;
