import eventController from "../controllers/eventController";
import commandController from "../controllers/commandController";
import BaseView from "./BaseView";
import navigationList from "../data/navigationList";
import cameraControlsGuiHTML from "./html/cameraControlsGUI.html";
import PhotoSwipe from "photoswipe";
import PhotoSwipeUI_Default from "../../../node_modules/photoswipe/dist/photoswipe-ui-default.min.js";

var NavigationBar = BaseView.extend({
  className: "navigation-bar",
  template: _.template("<li><a><%= displayTitle %></a></li>"),
  events: {
    "click li": "clickSelected",
    "mouseenter li": "enterHoverNavigationLi",
    "mouseleave li": "leaveHoverNavigationLi",
    "click .2d": "switchView2d",
    "click .3d": "switchView3d",
    "click .resetCamera": "resetScene"
  },
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    _.bindAll(this, "getSelectedSection");
    this.parentEl = options.parentEl;
    this.height = 45;
    this.addListeners();
  },
  addListeners: function () {
    eventController.on(eventController.HOVER_NAVIGATION, this.updateHoverNavigationFrom3d, this);
    eventController.on(eventController.SCENE_MODEL_SELECTED, this.setSelectedFrom3d, this);
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
    if (this.selectedEl) return this.selectedEl.index();
    return 0;
  },
  updateHoverNavigationFrom3d: function (closestObject) {
    if (this.hoveredEl && closestObject ) {
      this.swapHoveredEl(this.navEls[closestObject.object.name]);
    } else if (this.hoveredEl) {
      this.hoveredEl.removeClass("hovered");
      this.hoveredEl = null;
    } else if (closestObject) {
      this.hoveredEl = this.navEls[closestObject.object.name].addClass("hovered");
    }
    var hoveredBool = this.hoveredEl ? true : false;
    this.updateHoverMouseCursor(hoveredBool)
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
  clickSelected: function (e) {
    var currentTarget = $(e.currentTarget);
    // if (currentTarget.hasClass("selected")) return; //same element click do not select again;
    this.swapSelectedEl(currentTarget);
    eventController.trigger(eventController.SWITCH_PAGE, currentTarget.index());
  },
  setSelectedFrom3d: function (sceneModel) {
    this.swapSelectedEl(this.navEls[sceneModel.name]);
  },
  switchView2d: function () {
    eventController.trigger(eventController.SWITCH_VIEWS, "2d");
  },
  switchView3d: function (what) {
    eventController.trigger(eventController.SWITCH_VIEWS, "3d");
  },
  resetScene: function () {
    _.each(this.navEls, function (el) {
      el.removeClass("hovered selected");
    });
    eventController.trigger(eventController.RESET_SCENE, "3d");
  },
  getCssMenu: function () {
    var cssMenu = "<div id='cssmenu'><ul>";

    _.each(navigationList, function(title){
      cssMenu += this.template({displayTitle: title.toUpperCase()});
    }, this);

    cssMenu += "</ul></div>";
    return cssMenu;
  },
  render: function () {
    this.$el.append(cameraControlsGuiHTML);
    this.$el.append(this.getCssMenu());
    this.$el.append("<div class='switch-views'><div class='2d'><a href='javascript:;'>2d</a></div><div class='3d'><a href='javascript:;'>3d</a></div></div>");
    this.cacheListEls();

    return this;
  },
  openPhotoSwipe: function () {
    var pswpElement = document.querySelectorAll('.pswp')[0];

      // build items array
      var items = [
          {
              src: 'https://placekitten.com/600/400',
              w: 600,
              h: 400
          },
          {
              src: 'https://placekitten.com/1200/900',
              w: 1200,
              h: 900
          }
      ];

      // define options (if needed)
      var options = {
        closeEl:true,
        captionEl: true,
        fullscreenEl: true,
        zoomEl: true,
        shareEl: true,
        counterEl: true,
        arrowEl: true,
        preloaderEl: true,
        index: 0 // start at first slide
      };

      // Initializes and opens PhotoSwipe
      console.log("PhotoSwipeUI_Default", PhotoSwipe);
      var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();
  }
});

module.exports = NavigationBar;
