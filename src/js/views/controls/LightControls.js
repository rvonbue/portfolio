import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
import THREE from "three";
import TWEEN from "tween.js";
import utils from "../../util/utils";
var worldColor = utils.getColorPallete().world.hex;

var LightControls = BaseView.extend({
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    this.scene = options.scene;
    this.ambientLights = [];
    this.skyGradientEl = $(".sky-gradient:first");
    this.skyGradientElClickNum = 0;
    console.log("this.skyGradientEl:", $(".navigation-bar:first"));
    $(".navigation-bar:first").on("click", _.bind(this.clickChangeSkyGradient, this));
    this.addLight();
    this.addListeners();
  },
  addListeners: function () {
    eventController.on(eventController.SCENE_MODEL_SELECTED, this.turnOnFloorLights, this);
    eventController.on(eventController.TOGGLE_AMBIENT_LIGHTING, this.toggleAmbientLighting, this);
  },
  removeListeners: function () {
    eventController.off(eventController.SCENE_MODEL_SELECTED, this.turnOnFloorLights, this);
      eventController.on(eventController.TOGGLE_AMBIENT_LIGHTING, this.toggleAmbientLighting, this);
  },
  clickChangeSkyGradient: function () {
    this.skyGradientElClickNum++;
    this.toggleAmbientLighting(this.skyGradientElClickNum % 2 == 0);
    if (this.skyGradientElClickNum > 23) this.skyGradientElClickNum = 0 ;
    var classNames = "sky-gradient" + " sky-gradient-" + this.skyGradientElClickNum;
    this.skyGradientEl.attr("class", classNames);
  },
  addLight: function () {
    this.addAmbientLight();
    this.addDirectionalLight();
    // this.addSpotLights();
  },
  toggleAmbientLighting: function (onOff) {
    _.each(this.ambientLights, function (light) {
      light.visible = onOff;
    });
  },
  addAmbientLight: function () {
    // var light = new THREE.AmbientLight( 0x404040 );
    // light.position.z = 1.5;
    // this.scene.add( light );
    var hemiLight = new THREE.HemisphereLight( 0x404040, worldColor, 0.65);
    this.ambientLights.push(hemiLight);
    this.scene.add( hemiLight );
  },
  addDirectionalLight: function () {
    var size = 1.3;
    var directionalLight = new THREE.DirectionalLight( worldColor, size );
    this.ambientLights.push(directionalLight);
    directionalLight.position.set( -0 , 15 , 15 );
    this.scene.add( directionalLight );
    this.scene.add( new THREE.DirectionalLightHelper( directionalLight, size ) );
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
