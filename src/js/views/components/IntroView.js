import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
import html from "../html/introView.html";

var SwitchView = BaseView.extend({
  className: "intro-view",
  events: {
    // "click #myonoffswitch": "clickSwitchViews",
    "click .intro-switch-2d": "switchView2d",
    "click .intro-switch-3d": "switchView3d",
  },
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    eventController.once(eventController.SWITCH_VIEWS, _.bind(this.animateDestroy, this));
    eventController.once(eventController.SET_VIEW, _.bind(this.animateDestroy, this));
    this.parentEl = options.parentEl;
  },
  switchView2d: function () {
    this.animateDestroy("2d");
    if ( localStorage ) localStorage.setItem('startView', "2d");
  },
  switchView3d: function () {
    this.animateDestroy("3d");
    if ( localStorage ) localStorage.setItem('startView', "3d");
  },
  animateDestroy: function (whichViewStr) {
    var offset = this.$el.offset();
    var self = this;

    this.$el
    .css({
      top: offset.top,
      left: offset.left,
      width: this.$el.width(),
      height: this.$el.height()
    })
    .addClass("animateSwitchView");

    setTimeout(function () {
      self.destroy(whichViewStr);
    }, 1000);

  },
  destroy: function (whichViewStr) {
    this.parentEl.removeClass("intro-view-open");
    eventController.trigger(eventController.SWITCH_VIEWS, whichViewStr);
    eventController.trigger(eventController.SET_VIEW, whichViewStr);
    this.undelegateEvents();
    this.$el.removeData().unbind();
    this.remove();
  },
  render: function () {
    this.$el.append(html);
    return this;
  }
});

module.exports = SwitchView;
