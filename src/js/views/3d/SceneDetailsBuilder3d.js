import Base3dView from "./Base3dView";
// import eventController from "../../controllers/eventController";
import THREE from "three";
import utils from "../../util/utils";

var SceneDetailsBuilder3d = Base3dView.extend({  //setups up all the inside lights and meshes for each individual floor
  initialize: function (options) {
    Base3dView.prototype.initialize.apply(this, arguments);
  },
  getAllDetails: function () {
    return { lights: this.getPointLights() };
  },
  getPointLights: function (sceneDetailsModel) {
    var positionY = sceneDetailsModel.get("sceneModel").get("object3d").position.y;
    var lightArray = sceneDetailsModel.get("pointLights");
    if (!lightArray.length) return lightArray;
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
