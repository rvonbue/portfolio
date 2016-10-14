import Base3dView from "./Base3dView";
import ArtItem3d from "../../models/artItem3d";

var ArtGalleryView3d = Base3dView.extend({
  name: "artGallery",
  ready: false,
  ART_ITEMS_PER_VIEW: 1,
  totalLoaded: 0,
  initialize: function () {
    Base3dView.prototype.initialize.apply(this, arguments);
    _.bindAll(this, "addInteractiveObjectToScene");
    this.currentItemViewIndex = 0;
    this.artItemMap = {};
  },
  loadInteractiveObjects: function () {
    this.loadArtItem();
  },
  loadArtItem: function () {
      new ArtItem3d(currentArtItem).on("READY", this.addInteractiveObjectToScene);
      // this.artItemArray.push(new ArtItem3d(currentArtItem).on("READY", this.addInteractiveObjectToScene));
  },
  addInteractiveObjectToScene: function (mesh) {
    // console.log("mesh", mesh);
    // console.log("this.model", this.model);
    this.model.get("object3d").add(mesh);
    this.artItemMap[this.currentItemViewIndex] = mesh;
    ++this.totalLoaded;
    this.readyCheck();
    // console.log("addInteractiveObjectToScene", this.artItemMap[this.currentItemViewIndex]);
  },
  readyCheck: function () {
      if (this.totalLoaded === this.ART_ITEMS_PER_VIEW ) {
        eventController.trigger(eventController.ADD_MODEL_TO_SCENE, this.model);
      }
  }
});

module.exports = ArtGalleryView3d;
