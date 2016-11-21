import THREE from "three";
import TWEEN from "tween.js";

import eventController from "../../../controllers/eventController";
import BaseView from "../../BaseView";
import skyGradients from "../../../data/skyGradients";
import utils from "../../../util/utils";
var worldColor = utils.getColorPallete().world;

var LightControls = BaseView.extend({
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    this.worldLights = [];
    this.skyGradientEl = $(".sky-gradient:first");
    this.skyGradientElClickNum = 20;
    // $(".navigation-bar:first").on("click", _.bind(this.clickChangeSkyGradient, this));
    this.clickChangeSkyGradient(9);
    this.addLight();
    this.addListeners();
  },
  addListeners: function () {
    eventController.on(eventController.TOGGLE_AMBIENT_LIGHTING, this.toggleWorldLighting, this);
    eventController.on(eventController.RESET_SCENE, this.resetScene, this);
    eventController.on(eventController.SET_SPOTLIGHT_TARGET, this.setSpotlightTarget, this);
    eventController.on(eventController.RESET_SCENE_DETAILS, this.resetToSceneDetails, this);
  },
  removeListeners: function () {
    eventController.off(eventController.TOGGLE_AMBIENT_LIGHTING, this.toggleWorldLighting, this);
    eventController.off(eventController.RESET_SCENE, this.resetScene, this);
    eventController.off(eventController.SET_SPOTLIGHT_TARGET, this.setSpotlightTarget, this);
    eventController.off(eventController.RESET_SCENE_DETAILS, this.resetToSceneDetails, this);
  },
  addLight: function () {
    this.addHemisphereLight();
    this.addDirectionalLight();
    // this.addSpotLights();
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, this.worldLights);
  },
  resetScene: function () {
    this.toggleWorldLighting(this.getResetLightSettings());
  },
  resetToSceneDetails: function (sceneModel) {
    var sceneDetails = sceneModel.get("sceneDetails");
    if ( sceneDetails ) this.toggleWorldLighting(sceneDetails.get("intialAmbientLights"));
  },
  getResetLightSettings: function () {
    return {
      hemisphere: [worldColor.hemisphere.sky, worldColor.hemisphere.ground, worldColor.hemisphere.intensity],
      directional: [worldColor.directional.color, worldColor.directional.intensity]
    };
  },
  clickChangeSkyGradient: function (newLightSettings) {
    if (this.skyGradientElClickNum > 23) this.skyGradientElClickNum = 0 ;
    var classNames = "sky-gradient" + " sky-gradient-" + this.skyGradientElClickNum;
    this.skyGradientEl.attr("class", classNames);
    var sky = skyGradients[this.skyGradientElClickNum][0];
    var ground = skyGradients[this.skyGradientElClickNum][1];
    this.toggleWorldLighting(
      {
        hemisphere: [sky, ground, worldColor.hemisphere.intensity],
        directional: [sky, worldColor.directional.intensity]
      }
    );
    this.skyGradientElClickNum++;
  },
  toggleWorldLighting: function (newLightSettings) {
    // if (!newLightSettings) return;
    _.each(this.worldLights, function (light) {
      if (light.type === "HemisphereLight"  ) this.setHemiLight(light, newLightSettings.hemisphere);
      if (light.type === "DirectionalLight")  this.setDirectionalLight(light, newLightSettings.directional);
    }, this);
  },
  getTween: function (light, endPos , speed) {
    var tween = new TWEEN.Tween(light)
    .to({ intensity: endPos }, speed)
    return tween;
  },
  setHemiLight: function (light, newLight) {
    light.skyColor =  new THREE.Color(newLight.skyColor);
    light.groundColor = new THREE.Color(newLight.groundColor);
    var tween = this.getTween(light, newLight.intensity, utils.getAnimationSpeed().lightOut, light );
    tween.start();
  },
  setDirectionalLight: function (light, newLight) {
    if (!newLight) return;
    light.color = light.hex = new THREE.Color(newLight.color);
    var tween = this.getTween(light, newLight.intensity, 1500);
    tween.start();
  },
  addDirectionalLight: function () {
    var directionalLight = new THREE.DirectionalLight(
      worldColor.directional.color,
      worldColor.directional.intensity
    )
    this.worldLights.push(directionalLight);
  },
  addHemisphereLight: function () {
    var hemiLight = new THREE.HemisphereLight(
      worldColor.hemisphere.sky,
      worldColor.hemisphere.ground,
      worldColor.hemisphere.intensity
    );
    this.worldLights.push(hemiLight);
  },
  getWorldLight: function (lightType) {
    return _.findWhere(this.worldLights, {type: lightType});
  },
  setSpotlightTarget: function (spotLightTarget) {
    var spotLight = this.getWorldLight("SpotLight");
    spotLight.target = spotLightTarget;
  },
  addSpotLights: function () {
    // color, intensity, distance, angle, penumbra, decay
    var color = "0xffffff";
    var sphereSize = 1;
    var spotlights = [
      // this.getNewSpotlight( 2.5, 4.5, 8, color),
      this.getNewSpotlight( 0, 30, 35, color),
      // this.getNewSpotlight( -2.5, 4.5, 8, color)
    ];

    _.each(spotlights, function (light) {
      this.worldLights.push(light);
      this.scene.add(light);
      this.scene.add(new THREE.SpotLightHelper( light, sphereSize ));
    }, this);
  },
  getNewSpotlight: function (x, y, z, color) {
    //color, intensity, distance, angle, penumbra, decay )
    var spotLight = new THREE.SpotLight( color, 50, 70, Math.PI / 6, 0, 2 );
    spotLight.position.set( x, y, z );
    spotLight.castShadow = true;
    return spotLight;
  }
});

module.exports = LightControls;
