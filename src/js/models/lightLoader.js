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
    // eventController.on(eventController.HOVER_NAVIGATION, this.movePointLights, this);
  },
  addLight: function () {
    this.addAmbientLight();
    // this.addDirectionalLight();
    this.addPointLights();
    // this.addSpotLights();
  },
  addAmbientLight: function () {
    // var light = new THREE.AmbientLight( 0x404040 );
    // light.position.z = 1.5;
    // this.scene.add( light );
    var hemiLight = new THREE.HemisphereLight( 0x404040, 0x040404, 1); //0xB82601
    this.scene.add( hemiLight );
  },
  addDirectionalLight: function () {
    var size = 0.7;
    var directionalLight = new THREE.DirectionalLight( 0xffffff, size );
    directionalLight.position.set( -30 , 15 , 15 );
    this.scene.add( directionalLight );
    this.scene.add( new THREE.DirectionalLightHelper( directionalLight, size ) );
  },
  movePointLights: function (intersect) {
    if (intersect !== null ) {
      var floorHeight = intersect.object.geometry.boundingBox.max.y / 2;
      var y = floorHeight + intersect.object.position.y;
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
    var color = "#B82601";
    this.pointLights = [
      // this.getNewPointLight( 3, 7.5, 7, color),
      // this.getNewPointLight( 0, 7.5, 7, color),
      // this.getNewPointLight( -3, 7.5, 7, color),
      this.getNewPointLight( 5.25, 2.25, 5.25, color),
      this.getNewPointLight( 5.25,7.25, 6.75, color)
      // this.getNewPointLight( 0, 4.5, 6, color),
      // this.getNewPointLight( -3, 4.5, 6, color)
    ];

    _.each(this.pointLights, function (light) {
      this.scene.add(light);
      this.scene.add(new THREE.PointLightHelper( light, sphereSize ));
    }, this );

    // var self = this;
    // setTimeout( function () {
    //   self.raiseLights(pointLights);
    // }, 2500);
    // eventController.trigger(eventController.ADD_DAT_GUI_CONTROLLER,{ arr: pointLights, key: "intensity", name:"light" });
  },
  getNewPointLight: function (x, y, z, color) {
    // color, intensity, distance, decay
    var light = new THREE.PointLight( color, 7, 2, 2 );
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

module.exports = LightLoader;
