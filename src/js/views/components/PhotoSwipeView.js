import PhotoSwipe from "photoswipe";

import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
import PhotoSwipeUI_Default from "../../../../node_modules/photoswipe/dist/photoswipe-ui-default.min.js";
import photoSwipeHtml from "../html/photoSwipe.html";

var PhotoSwipeView = BaseView.extend({
  className: "photo-swipe",
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    this.parentEl = options.parentEl;
    this.addListeners();
  },
  addListeners: function () {
    eventController.once(eventController.OPEN_PHOTO_SWIPE, this.render, this);
    eventController.on(eventController.OPEN_PHOTO_SWIPE, this.openPhotoSwipe, this);
  },
  openPhotoSwipe: function (imgArray, startIndex) {
    startIndex = startIndex || 0;
    var pswpElement = document.querySelectorAll('.pswp')[0];
    var options = {
      // closeEl:true,
      // captionEl: true,
      // fullscreenEl: true,
      // zoomEl: true,
      // shareEl: true,
      // counterEl: true,
      // arrowEl: true,
      // preloaderEl: true,
      index: startIndex // start at first slide
    };

    // Initializes and opens PhotoSwipe
    var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, imgArray, options);
    gallery.init();
  },
  render: function () {
    this.pswpElement = this.$el.find(".pswp:first")[0];
    this.parentEl.append(photoSwipeHtml);
    return this;
  },
});

module.exports = PhotoSwipeView;
