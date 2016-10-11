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
    this.addListeners();
  },
  addListeners: function () {
    eventController.on(eventController.HOVER_NAVIGATION, this.updateNavigation, this);
  },
  cacheListEls: function () {
    var navEljq = this.$el.find("li");
    this.navEls = {};
    _.each(navigationList, function (name, i) {
      this.navEls[name] = $(navEljq[i]);
    }, this);

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
    this.selectedEl.removeClass("selected");
    this.selectedEl = newSelectedEl.addClass("selected");
  },
  updateCamera: function (e) {
    eventController.trigger(eventController.SWITCH_SCENE, this.navigationItems[$(e.currentTarget).index()].name);
  },
  render: function () {
    var cssMenu = "<div id='cssmenu'><ul>";

    _.each(navigationList, function(title){
      cssMenu += this.template({displayTitle: title.toUpperCase()});
    }, this);

    cssMenu += "</ul></div>";
    this.$el.append(cssMenu);
    this.$el.append("<div class='switch-views'><div class='2d'><a href='javascript;;'>2d</a></div><div class='3d'><a href='javascript;;'>3d</a></div></div>");
    this.cacheListEls();

    return this;
  }
});

module.exports = NavigationBar;
