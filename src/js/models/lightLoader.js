import eventController from "../controllers/eventController";
import BaseModel from "./BaseModel";
import THREE from "three";
import TWEEN from "tween.js";

var LightLoader = BaseModel.extend({
  initialize: function (options) {
    BaseModel.prototype.initialize.apply(this, arguments);
    this.scene = options.scene;
    this.addLight();
  },
  addLight: function () {
    // var light = new THREE.AmbientLight( 0x404040 );
    // light.position.y = 25;
    // this.scene.add( light );
    // var plight = new THREE.PointLight( 0x404040, 25, 50 );
    // plight.position.set( 0, 25, 0 );
    // this.scene.add( plight );
    //
    // var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    // directionalLight.position.set( 0, 50, 0 );
    // this.scene.add( directionalLight );
    this.addPointLights();
    // this.addSpotLights();
  },
  addPointLights: function () {

    var pointLights = [
      this.getNewPointLight( -6, 15, -6 ),
      this.getNewPointLight( 6, 15, -6 ),
      this.getNewPointLight( 6, 15, 6 ),
      this.getNewPointLight( -6, 15, 6 ),
    ];

    _.each(pointLights, function (light) {
      this.scene.add(light);
    },this );

    var self = this;
    setTimeout( function () {
      self.raiseLights(pointLights);
    }, 2500);
    eventController.trigger(eventController.ADD_DAT_GUI_CONTROLLER,{ arr: pointLights, key: "intensity", name:"light" });
  },
  getNewPointLight: function (x, y, z) {
    var light = new THREE.PointLight( 0x404040, 0, 50 );
    light.position.set( x, y, z );
    return light;
  },
  raiseLights: function (lights) {

    var position = { pointLight : 0 };
    var target = { pointLight : 2 };

    var tween2 = new TWEEN.Tween(position).to(target, 100)
    .easing(TWEEN.Easing.Quadratic.Out).onUpdate(function () {
      _.each(lights, function (light) {
        light.intensity = position.pointLight;
      });
    })
    .start();
  },
  addSpotLights: function () {
    var directionalLight = new THREE.SpotLight( 0xffffff );
    directionalLight.position.set( 0, 10, 0 );
    this.scene.add( directionalLight );

    var directionalLight2 = new THREE.SpotLight( 0xff00ff );
    directionalLight2.position.set( 25, 10, 0 );
    this.scene.add( directionalLight2 );
    directionalLight2.castShadow = true;
    console.log("directionalLight2:", directionalLight2);
    var directionalLight3 = new THREE.SpotLight( 0xffffff );
    directionalLight3.position.set(-10, 10, 0 );
    this.scene.add( directionalLight3 );

    var spotLightHelper = new THREE.SpotLightHelper( directionalLight );
    this.scene.add( spotLightHelper );

    var spotLightHelper2 = new THREE.SpotLightHelper( directionalLight2 );
    this.scene.add( spotLightHelper2 );

    var spotLightHelper3 = new THREE.SpotLightHelper( directionalLight3 );
    this.scene.add( spotLightHelper3 );
  }
});

module.exports = LightLoader;
