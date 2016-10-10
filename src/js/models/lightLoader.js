import eventController from "../controllers/eventController";
import BaseModel from "./BaseModel";
import THREE from "three";
import TWEEN from "tween.js";

var LightLoader = BaseModel.extend({
  initialize: function (options) {
    BaseModel.prototype.initialize.apply(this, arguments);
    this.scene = options.scene;
    this.addLight();
    this.addListeners();
  },
  addListeners: function () {
    eventController.on(eventController.HOVER_NAVIGATION, this.movePointLights, this);
  },
  addLight: function () {
    this.addAmbientLight();
    this.addDirectionalLight();
    this.addPointLights();
    // this.addSpotLights();
  },
  addAmbientLight: function () {
    var light = new THREE.AmbientLight( 0x404040 );
    light.position.z = 1.5;
    this.scene.add( light );
  },
  addDirectionalLight: function () {
    var size = 0.5333;
    var directionalLight = new THREE.DirectionalLight( 0xffffff, size );
    directionalLight.position.set( -15 , 15 , 15 );
    this.scene.add( directionalLight );
    this.scene.add( new THREE.DirectionalLightHelper(directionalLight, size) );
  },
  movePointLights: function (intersect) {
    if (intersect !== null ) {
      var y = intersect.object.position.y;
      _.each(this.pointLights, function (light) {
        light.position.y = y;
        light.visible = true;
      });
    } else {
      _.each(this.pointLights, function (light) {
        light.visible = false;
      });
    }

  },
  addPointLights: function () {
    var sphereSize = 0.25;
    var color = "#FFFFFF";
    this.pointLights = [
      this.getNewPointLight( 3, 4.5, 8, color),
      this.getNewPointLight( 0, 4.5, 8, color),
      this.getNewPointLight( -3, 4.5, 8, color),
    ];

    _.each(this.pointLights, function (light) {
      this.scene.add(light);
      // this.scene.add(new THREE.PointLightHelper( light, sphereSize ));
    }, this );

    var self = this;
    // setTimeout( function () {
    //   self.raiseLights(pointLights);
    // }, 2500);
    // eventController.trigger(eventController.ADD_DAT_GUI_CONTROLLER,{ arr: pointLights, key: "intensity", name:"light" });
  },
  getNewPointLight: function (x, y, z, color) {
    // color, intensity, distance, decay
    var light = new THREE.PointLight( color, 7, 3, 2 );
    light.position.set( x, y, z );
    return light;
  },
  raiseLights: function (lights) {

    var position = { pointLight : 0 };
    var target = { pointLight : 2 };

    var tween2 = new TWEEN.Tween(position).to(target, 2000)
    .easing(TWEEN.Easing.Quadratic.Out).onUpdate(function () {
      _.each(lights, function (light) {
        light.intensity = position.pointLight;
      });
    })
    .start();
  },
  addSpotLights: function () {
    // color, intensity, distance, angle, penumbra, decay
    var color = "0xffffff";
    var sphereSize = 1;
    var spotlights = [
      // this.getNewSpotlight( 2.5, 4.5, 8, color),
      this.getNewSpotlight( 0, 4.5, 12, color),
      // this.getNewSpotlight( -2.5, 4.5, 8, color)
    ];

    _.each(spotlights, function (light) {
      this.scene.add(light);
      this.scene.add(new THREE.SpotLightHelper( light, sphereSize ));
    },this );

  },
  getNewSpotlight: function (x, y, z, color) {
    var directionalLight = new THREE.SpotLight( color );
    directionalLight.position.set( x, y, z );
    return directionalLight;
  }
});

module.exports = LightLoader;
