import Base3dView from "./Base3dView";
// import eventController from "../../controllers/eventController";
import THREE from "three";
import fontData from "../../data/roboto_regular.json";
import utils from "../../util/utils";

var SceneDetailsBuilder3d = Base3dView.extend({  //setups up all the inside lights and meshes for each individual floor
  initialize: function (options) {
    Base3dView.prototype.initialize.apply(this, arguments);
  },
  setup: function (sceneDetailsModel) {
    var positionY = sceneDetailsModel.get("sceneModel").get("object3d").position.y;
    return this.buildPointLights(sceneDetailsModel.get("pointLights"), positionY);
  },
  buildPointLights: function (lightArray, positionY) {
    if (!lightArray.length) return;
    var pointLightArr = lightArray.map(function (pl) {
      var light = new THREE.PointLight( pl.color, pl.intensity, pl.distance, 2 );
      var floorStartHeight =
      light.position.set(pl.x, pl.y + positionY, pl.z);
      return light;
    });
    return pointLightArr;
  }
});

module.exports = SceneDetailsBuilder3d;
