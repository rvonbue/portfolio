import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
import THREE from "three";
import TWEEN from "tween.js";
import skyGradients from "../../data/skyGradients";
import utils from "../../util/utils";
var worldColor = utils.getColorPallete().world;


var LightControls = BaseView.extend({
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    this.scene = options.scene;
    this.worldLights = [];
    this.skyGradientEl = $(".sky-gradient:first");
    this.skyGradientElClickNum = 0;
    $(".navigation-bar:first").on("click", _.bind(this.clickChangeSkyGradient, this));
    this.addLight();
    this.addListeners();
  },
  addListeners: function () {
    eventController.on(eventController.TOGGLE_AMBIENT_LIGHTING, this.toggleWorldLighting, this);
    eventController.on(eventController.RESET_SCENE, this.resetScene, this);
  },
  removeListeners: function () {
    eventController.off(eventController.TOGGLE_AMBIENT_LIGHTING, this.toggleAmbientLighting, this);
    eventController.off(eventController.RESET_SCENE, this.resetScene, this);
  },
  addLight: function () {
    this.addHemisphereLight();
    this.addDirectionalLight();
    // this.addSpotLights();
  },
  resetScene: function () {
    this.toggleWorldLighting(this.getResetLightSettings());
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
    var ground = skyGradients[this.skyGradientElClickNum][skyGradients[this.skyGradientElClickNum].length - 1];
    this.toggleWorldLighting(
      {
        hemisphere: [sky, ground, worldColor.hemisphere.intensity],
        directional: [sky, worldColor.directional.intensity]
      }
    );
    this.skyGradientElClickNum++;
  },
  getHemisphereLight: function () {

  },
  toggleWorldLighting: function (newLightSettings) {
    _.each(this.worldLights, function (light) {
      if (light.type === "HemisphereLight"  ) this.setHemiLight(light, newLightSettings.hemisphere);
      if (light.type === "DirectionalLight" && newLightSettings.directional) this.setDirectionalLight(light, newLightSettings.directional);
    }, this);
  },
  setHemiLight: function (light, newLightSettings) {
    console.log("light", light);
    light.skyColor =  new THREE.Color(newLightSettings[0]);
    light.groundColor = new THREE.Color(newLightSettings[1]);
    light.intensity = newLightSettings[2];
    // light.visible = newLightSettings.hemisphere[2] > 0 ? true : false; // if intensity if 0 turn off light
  },
  setDirectionalLight: function (light, newLightSettings) {
    light.color = light.hex = new THREE.Color(newLightSettings[0]);
    light.intensity = newLightSettings[1];
  },
  addDirectionalLight: function () {
    var directionalLight = new THREE.DirectionalLight(
      worldColor.directional.color,
      worldColor.directional.intensity
    )
    this.worldLights.push(directionalLight);
    // directionalLight.position.set( -0 , 15 , 15 );
    this.scene.add( directionalLight );
    this.scene.add( new THREE.DirectionalLightHelper( directionalLight, worldColor.directional.intensity ) );
  },
  addHemisphereLight: function () {
    var hemiLight = new THREE.HemisphereLight(
      worldColor.hemisphere.sky,
      worldColor.hemisphere.ground,
      worldColor.hemisphere.intensity
    );
    this.worldLights.push(hemiLight);
    this.scene.add( hemiLight );
  },
  // raiseLights: function (lights) {
  //
  //   var position = { pointLight : 0 };
  //   var target = { pointLight : 2 };
  //
  //   var tween2 = new TWEEN.Tween(position).to(target, 2000)
  //   .easing(TWEEN.Easing.Quadratic.Out).onUpdate(function () {
  //     _.each(lights, function (light) {
  //       light.intensity = position.pointLight;
  //     });
  //   })
  //   .start();
  // },
  addSpotLights: function () {
    // color, intensity, distance, angle, penumbra, decay
    var color = "0xffffff";
    var sphereSize = 1;
    var spotlights = [
      // this.getNewSpotlight( 2.5, 4.5, 8, color),
      this.getNewSpotlight( 0, 2, 9, color),
      // this.getNewSpotlight( -2.5, 4.5, 8, color)
    ];

    _.each(spotlights, function (light) {
      this.scene.add(light);
      this.scene.add(new THREE.SpotLightHelper( light, sphereSize ));
    },this );

  },
  getNewSpotlight: function (x, y, z, color) {
    //color, intensity, distance, angle, penumbra, decay )
    var spotLight = new THREE.SpotLight( color, 5, 15, Math.PI / 6, 1, 1 );
    spotLight.position.set( x, y, z );
    spotLight.castShadow = true;
    spotLight.angle = Math.PI / 10;
    return spotLight;
  }
});

module.exports = LightControls;
