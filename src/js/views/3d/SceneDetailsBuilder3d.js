import Base3dView from "./Base3dView";
// import eventController from "../../controllers/eventController";
import { PointLight } from "three";
import utils from "../../util/utils";
// import canvas from "../../data/embeded3dModels/canvas.json";
// import easel from "../../data/embeded3dModels/easel.json";

var SceneDetailsBuilder3d = Base3dView.extend({  //setups up all the inside lights and meshes for each individual floor
  initialize: function (options) {
    Base3dView.prototype.initialize.apply(this, arguments);
  },
  setSceneDetails: function (sceneDetailsModel) {
    sceneDetailsModel.set("sceneLights", this.getPointLights(sceneDetailsModel));
    sceneDetailsModel.addInteractiveObjects();
  },
  getPointLights: function (sceneDetailsModel) {
    var positionY = sceneDetailsModel.get("parentScenePosition").y;
    var lightArray = sceneDetailsModel.get("pointLights");
    if (!lightArray.length) return lightArray;

    return lightArray.map(function (pl) {
     var light = new PointLight( pl.color, pl.intensity, pl.distance, 2 );
     light.position.set(pl.x, pl.y + positionY, pl.z);
     return light;
   });
  }
});

module.exports = SceneDetailsBuilder3d;
