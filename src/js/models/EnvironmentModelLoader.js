import eventController from "../controllers/eventController";
import BaseModel from "./BaseModel";

var EnvironmentModelLoader = BaseModel.extend({
  defaults: {},
  initialize: function( options ) {
    this.loadCubeMap();
  },
  loadCubeMap: function () {
    var format = '.jpg';
    var path = "textures/yokohama3/";
    var urls = [
        path + 'posx' + format, path + 'negx' + format,
        path + 'posy' + format, path + 'negy' + format,
        path + 'posz' + format, path + 'negz' + format
      ];
    var reflectionCube = new THREE.CubeTextureLoader().load( urls );
    reflectionCube.format = THREE.RGBFormat;
    eventController.trigger(eventController.LOAD_ENV_CUBE, reflectionCube);
  }
});

module.exports = EnvironmentModelLoader;
