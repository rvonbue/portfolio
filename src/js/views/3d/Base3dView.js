import BaseView from "../BaseView";
import eventController from "../../controllers/eventController";
import SceneModel from "../../models/sceneModel";

var Base3dView = BaseView.extend({
  name: null,
  ready: true,
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
  },
  render3d: function () {

  }
});

module.exports = Base3dView;
