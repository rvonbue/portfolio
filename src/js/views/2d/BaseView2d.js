var BaseView2d = Backbone.View.extend({
  childViews: [],
  className: "DEfault",
  title: "DEfault",
  titleTemplate: _.template("<h2 class='section-title'><%= title %></h2><hr class='first'/>"),
  initialize: function () {
    this.$el.hide();
    var self = this;

    this.$el.on("click", "img", function () {
      self.openPhotoSwipe(this);
    });
  },
  hide: function () {
    this.$el.fadeOut();
    // this.removeListeners();
  },
  openPhotoSwipe: function (el) {
    var source = $(el).data("imgSrc");
    console.log("hello", source);
    eventController.trigger(eventController.OPEN_PHOTO_SWIPE,
      [{ src: source, w: 1920, h: 1080 }],
      0
    );
  },
  show: function () {
    this.$el.delay(400).fadeIn();
    // this.addListeners();
  },
  removeListeners: function () {

  },
  close: function () {
    this.remove();
  }
});

module.exports = BaseView2d;
