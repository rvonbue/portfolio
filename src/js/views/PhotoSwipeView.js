import eventController from "../controllers/eventController";
import BaseView from "./BaseView";
import PhotoSwipe from "photoswipe";
import PhotoSwipeUI_Default from "../../../node_modules/photoswipe/dist/photoswipe-ui-default.min.js";
import photoSwipeHtml from "./html/photoSwipe.html";

var PhotoSwipeView = BaseView.extend({
  className: "photo-swipe",
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    this.addListeners();
  },
  addListeners: function () {
    eventController.on(eventController.OPEN_PHOTO_SWIPE, this.openPhotoSwipe, this);
  },
  render: function () {
    this.$el.append(photoSwipeHtml);
    this.pswpElement = this.$el.find(".pswp:first")[0];
    return this;
  },
  openPhotoSwipe: function (imgArray, startIndex) {
    startIndex = startIndex || 0;
    console.log("startIndex", startIndex)
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
  }
});

module.exports = PhotoSwipeView;
