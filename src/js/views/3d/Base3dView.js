import BaseView from "../BaseView";
import eventController from "../../controllers/eventController";
import SceneModel from "../../models/SceneModel";

var Base3dView = BaseView.extend({
  name: null,
  ready: true,
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    eventController.once(eventController.MODEL_LOADED, this.sceneModelLoaded, this );
    this.loadSceneModel();
  },
  loadSceneModel: function () {
    eventController.trigger(eventController.LOAD_NEW_SCENE, "models/" + this.name +".json", {name: this.name});
  },
  sceneModelLoaded: function (obj) {
    this.model = new SceneModel(obj);
    console.log("ready", this.ready);
    if (this.ready === true ) {
      eventController.trigger(eventController.ADD_MODEL_TO_SCENE, this.model);
    } else {
      this.loadInteractiveObjects();
    }
  },
  render3d: function () {

  }
});

module.exports = Base3dView;
