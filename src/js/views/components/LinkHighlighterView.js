import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
import utils from "../../util/utils";

var LinkHighlighterView = BaseView.extend({
  className: "link-bar",
  initialize: function () {
    this.addListeners();
  },
  addListeners: function () {
    eventController.on(eventController.MOVE_SCENE_SELECTOR, this.showHide, this);
  },
  removeListeners: function () {
    eventController.off(eventController.MOVE_SCENE_SELECTOR, this.showHide, this);
  },
  showHide: function (object3d) {
    var amIaLink = object3d && object3d.clickData && (object3d.clickData.action === "link");
    if ( !object3d || !amIaLink ) {
      this.hide()
      return;
    }
    this.show( object3d.clickData.url );
  },
  show: function (linkText) {
    this.$el.addClass("show");
    linkText = linkText ? linkText : "";
    this.linkEl.text(linkText);
  },
  hide: function () {
    this.$el.removeClass("show");
  },
  render: function () {
    this.linkEl = $("<a></a>");
    this.$el.append(this.linkEl);
    return this;
  }
});
module.exports = LinkHighlighterView;
