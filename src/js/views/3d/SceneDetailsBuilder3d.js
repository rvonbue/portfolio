import Base3dView from "./Base3dView";
// import eventController from "../../controllers/eventController";
import { PointLight } from "three";
import utils from "../../util/utils";
import lightMesh from "../../data/embeded3dModels/overheadLight.json";
// import easel from "../../data/embeded3dModels/easel.json";

var SceneDetailsBuilder3d = Base3dView.extend({  //setups up all the inside lights and meshes for each individual floor
  initialize: function (options) {
    Base3dView.prototype.initialize.apply(this, arguments);
  },
  setSceneDetails: function (sceneDetailsModel) {
    var lightArray = sceneDetailsModel.get("pointLights");
    sceneDetailsModel.set("sceneLights", this.getPointLights(sceneDetailsModel, lightArray));
    // this.addLightModels(sceneDetailsModel, lightArray);
    sceneDetailsModel.addInteractiveObjects();
  },
  getPointLights: function (sceneDetailsModel, lightArray) {
    if (!lightArray.length) return [];
    var self = this;

    return lightArray.map(function (pl) {
      var light = new PointLight( pl.color, pl.intensity, pl.distance, 2 );
      self.moveObjectToScene(light, pl, { y: sceneDetailsModel.get("parentScenePosition").y });
      return light;
   });
 },
 moveObjectToScene: function (obj, pos, newPos) {
   var newY = newPos.y + pos.y;
   obj.position.set(pos.x, newY, pos.z);
 },
 // addLightModels: function (sceneDetailsModel, lightArray) {
 //    if ( !lightArray.length ) return;
 //
 //    var overheadLightMesh = commandController.request(commandController.PARSE_JSON_MODEL, lightMesh);
 //    var self = this;
 //    var sceneDetailsMesh = sceneDetailsModel.get("object3d");
 //
 //    var lights = lightArray.map( function (lightPos) {
 //      var meshClone = overheadLightMesh.clone();
 //      self.moveObjectToScene(meshClone,lightPos, {y:sceneDetailsModel.get("parentScenePosition").y});
 //      return meshClone;
 //    });
 //
 //    console.log("lights: ", lights);
 //    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, lights);
 // }
});

module.exports = SceneDetailsBuilder3d;
