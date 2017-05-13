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
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    eventController.once(eventController.SWITCH_VIEWS, _.bind(this.animateDestroy, this));
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
      right: ($(window).width() - (offset.left + this.$el.outerWidth())),
      width: this.$el.width(),
      height: this.$el.height()
    })
    .addClass("animateSwitchView");

    setTimeout(function () {
      eventController.trigger(eventController.SWITCH_VIEWS, whichViewStr);
      self.destroy();
    }, 1000);

  },
  destroy: function () {
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
