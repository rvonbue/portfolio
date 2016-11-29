import eventController from "../../controllers/eventController";
import commandController from "../../controllers/commandController";
import BaseView from "../BaseView";
import navigationList from "../../data/navigationList";

var NavigationBar = BaseView.extend({
  className: "navigation-bar",
  template: _.template("<li><a class='hvr-sweep-to-top normal'><%= displayTitle %></a><a class='css-icons<%= i %>'></a></li>"),
  events: {
    "click li": "clickSelected",
    "mouseenter li": "enterHoverNavigationLi",
    "mouseleave li": "leaveHoverNavigationLi",
  },
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    _.bindAll(this, "getSelectedSection");
    this.parentEl = options.parentEl;
    this.height = 45;
    this.addListeners();
  },
  addListeners: function () {
    eventController.on(eventController.RESET_SCENE, this.resetScene, this);
    eventController.on(eventController.HOVER_NAVIGATION, this.updateHoverNavigationFrom3d, this);
    eventController.on(eventController.SCENE_MODEL_SELECTED, this.setSelectedFrom3d, this);
    commandController.reply(commandController.GET_SELECTED_SECTION, this.getSelectedSection);
  },
  cacheListEls: function () {
    var navEljq = this.$el.find("li");
    this.navEls = {};
    _.each(navigationList, function (navListObj, i) {
      this.navEls[navListObj.name] = $(navEljq[i]);
    }, this);
  },
  getSelectedSection: function () {
    if (this.selectedEl) return this.selectedEl.index();
    return 0;
  },
  updateHoverNavigationFrom3d: function (closestObject) {

    if (!closestObject || (closestObject && !this.navEls[closestObject.object.name])) {
      var updateCursor = closestObject ? true : false;
      this.updateHoverMouseCursor(updateCursor);
      this.unsetHoverEl();
      return;
    }

    if (this.hoveredEl && closestObject ) {
      this.swapHoveredEl(this.navEls[closestObject.object.name]);
    } else if (this.hoveredEl) {
      this.unsetHoverEl();
    } else {
      this.hoveredEl = this.navEls[closestObject.object.name].addClass("hovered");
    }

    var hoveredBool = this.hoveredEl ? true : false;
    this.updateHoverMouseCursor(hoveredBool);
  },
  unsetHoverEl: function () {
    if (this.hoveredEl) {
      this.hoveredEl.removeClass("hovered");
      this.hoveredEl = null;
    }
  },
  updateHoverMouseCursor: function (hoveredBool) {
    this.parentEl.toggleClass("hovered", hoveredBool);
  },
  enterHoverNavigationLi: function (evt) {
    eventController.trigger(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR, navigationList[$(evt.currentTarget).index()] , true );
  },
  leaveHoverNavigationLi: function (evt) {
    eventController.trigger(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR, navigationList[$(evt.currentTarget).index()] , false );
  },
  swapSelectedEl: function (newSelectedEl) {
    if (!newSelectedEl) return;
    if (this.selectedEl) this.selectedEl.removeClass("selected");
    this.selectedEl = newSelectedEl.addClass("selected");
  },
  swapHoveredEl: function (newSelectedEl) {
    if (!newSelectedEl || this.hoveredEl === newSelectedEl ) return;
    if (this.hoveredEl) this.hoveredEl.removeClass("hovered");
    this.hoveredEl = newSelectedEl.addClass("hovered");
  },
  clickSelected: function (evt) {
    var currentTarget = $(evt.currentTarget);
    var name = navigationList[currentTarget.index("li")].name;

    this.swapSelectedEl(currentTarget);
    eventController.trigger(eventController.SWITCH_PAGE, name);
  },
  setSelectedFrom3d: function (sceneModel) {
    this.swapSelectedEl(this.navEls[sceneModel.name]);
  },
  resetScene: function () {
    _.each(this.navEls, function (el) {
      el.removeClass("hovered selected");
    });
  },
  getCssMenu: function () {
    var cssMenu = "<div id='cssmenu'><ul>";

    _.each(navigationList, function(navListObj, i){
      cssMenu += this.template({displayTitle: navListObj.name.toUpperCase(), i});
    }, this);

    cssMenu += "</ul></div>";
    return cssMenu;
  },
  render: function () {
    this.$el.append(this.getCssMenu());
    this.cacheListEls();

    return this;
  }
});

module.exports = NavigationBar;
