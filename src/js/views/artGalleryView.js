import eventController from "../controllers/eventController";
import BaseView from "./BaseView";
var ArtItem = require("models/ArtItem");

var ArtGalleryView = BaseView.extend({
  // className: "navigation-bar",
  // template: _.template("<li><a><%= displayTitle %></a></li>"),
  // events: {
  //   "click li": "updateCamera"
  // },
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    var self = this;
  },
  loadArtItems: function () {
    var artItem = new ArtItem({ name: "google", imgSrc: "images/CRUSER_v4.1_noWhite_subText.jpg" });
    artItem.once("ART_ITEM_LOADED", function () {
      var sceneModel = this.sceneCollection.add(artItem);
      eventController.trigger(eventController.ADD_MODEL_TO_SCENE, sceneModel);
    }, this);
  },
  getPlacard: function () {

  },
  render: function () {
    return this;
  }
});

module.exports = ArtGalleryView3d;
