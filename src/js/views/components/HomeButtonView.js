import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
import navigationList from "../../data/navigationList";
import utils from "../../util/utils";
// import CMenu from "circular-menu";
import CMenu from "../../libs/circular-menu.js";

var HomeButtonView = BaseView.extend({
  className: "home-button-container",
  LEAVE_TIMER: 1500,
  events: {
    "click .button-toggle-close": "toggleMenu",
    "click .button-toggle-close.open": "resetSceneDetails",
    // "mouseenter .button-home": "hoverHome",
    // "mouseleave #menu1": "startLeaveTimer",
    "mouseenter ul>li": "enterMenuItem",
    "mouseleave ul>li": "startLeaveTimer",
    "click #menu1": "closeMenu",
    "click ul>li>a": "clickme"
  },
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
  },
  addListeners: function () {
    // this.delegateEvents();
  },
  removeListeners: function () {
    // this.undelegateEvents();
  },
  startLeaveTimer: function () {
    var self = this;

    this.leaveTimer = setTimeout( function () {
      self.closeMenu();
    }, this.LEAVE_TIMER);

    this.leaveHoverNavigationLi();
  },
  enterMenuItem: function (evt) {
    this.cancelLeaveTimer();
    var index = $(evt.currentTarget).index();
    this.enterHoverNavigationLi(index);
  },
  cancelLeaveTimer: function () {
    if ( this.leaveTimer ) {
      clearTimeout(this.leaveTimer);
      this.leaveTimer = null;
    }
  },
  clickme: function (evt) {
    var clickedIndex = $(evt.currentTarget).closest("li").index();
    var navList = navigationList[clickedIndex];
    this.toggleMenu(false);

    if ( navList ) {
      eventController.trigger(eventController.SWITCH_PAGE, clickedIndex );
    } else {
      this.resetSceneDetails();
    }

  },
  closeMenu: function () {
    this.toggleMenu(false);
    this.cancelLeaveTimer();
  },
  resetSceneDetails: function () {
    eventController.trigger(eventController.RESET_SCENE);
  },
  getMenuItems: function () {
    var self = this;
    var menuItems = navigationList.map( function (name, i ) {
      return {
        icon: "css-icons" + i,
       };
    });
    menuItems.push( { icon: "button-home" });
    return menuItems;
  },
  getMenuPosition: function () {
    this.buttonToggleCloseEl  = this.$el.find(".button-toggle-close");
    var position = this.buttonToggleCloseEl.offset();
    var width = this.buttonToggleCloseEl.width() /2;
    return {
      left: position.left + ( this.buttonToggleCloseEl.width() /2 ),
      top: position.top + ( this.buttonToggleCloseEl.height() / 2 ) - 35 //magic number
    };
  },
  enterHoverNavigationLi: function (index) {
    eventController.trigger(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR, navigationList[index] , true );
  },
  leaveHoverNavigationLi: function () {
    eventController.trigger(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR);
  },
  nearestPowerOfTwo: function ( value ) {
	   return Math.pow( 2, Math.round( Math.log( value ) / Math.LN2 ) );
	},
  getCircularMenu: function () {
    // var menuItems = this.getMenuItems();
    var windowWidth = $(window).width();
    var diameter = windowWidth < 400 ? windowWidth : 400;
    diameter = Math.max(diameter, 200);
    this.menu = CMenu("#menu1")
    .config({
      // background: "rgba(0,0,0,0)",
      background: "#000000",
      backgroundHover: "#B82601",
      totalAngle: 180,
      position: "top",
      hideAfterClick : false,
      diameter: diameter,
      menus: this.getMenuItems()
    });

    this.menu.styles({ "border-top": "5px solid #ccc" });

  },
  isMenuVisible: function () {
    // console.log("isMenuVisible: ", this.menu.open);
    return this.menu.open;
  },
  showMenu: function () {
    var menuPosition = this.getMenuPosition();
    this.menu.show([menuPosition.left, menuPosition.top]);
    this.buttonToggleCloseEl.addClass("open");
    this.menu.open = true;
  },
  hideMenu: function () {
    this.menu.hide();
    this.menu.open = false;
    this.buttonToggleCloseEl.removeClass("open");
    this.leaveHoverNavigationLi();
  },
  toggleMenu: function (hideBool) {
    this.shouldCreateMenu();

    if (this.isMenuVisible() || hideBool === false) {
      this.hideMenu();
    } else {
      this.showMenu();
    }
    this.cancelLeaveTimer();
  },
  shouldCreateMenu: function () {
    if ( !this.menu ) {
      this.getCircularMenu();
      this.showMenu();
      this.menu.open = false;
    }
  },
  render: function () {
    this.$el.append("<div class='button-toggle-close'></div>");
    this.$el.append("<div id='menu1'></div>");
    return this;
  }
});
module.exports = HomeButtonView;
