import THREE from "three";
import TWEEN from "tween.js";
import raf from "raf";

import BaseView from "./BaseView";
import eventController from "../controllers/eventController";
import LightControls from "./3d/controls/LightControls";
import CameraControls from "./3d/controls/cameraControls";
import SceneControls from "./3d/controls/SceneControls";
import SceneDetailControlsView from "./3d/controls/SceneDetailControlsView";
import StatsView from "./components/statsView";

var AppView3d = BaseView.extend({
  className: "appView-3d",
  parentClass: "threeD",
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    _.bindAll(this, "animate", "addModelsToScene", "resize");
    this.parentEl = options.parentEl;
    this.clock = new THREE.Clock();
  },
  addListeners: function () {
    eventController.on(eventController.ADD_MODEL_TO_SCENE, this.addModelsToScene);
    eventController.on(eventController.SET_RENDER_VIDEO_TEXTURE, this.setRenderVideoTexture, this);
    eventController.on(eventController.REMOVE_MODEL_FROM_SCENE, this.removeModelsFromScene);
    $(window).on("resize", this.resize);
  },
  removeListeners: function () {
    eventController.off(eventController.ADD_MODEL_TO_SCENE, this.addModelsToScene);
    eventController.off(eventController.REMOVE_MODEL_FROM_SCENE, this.removeModelsFromScene);
    $(window).off("resize", this.resize);
  },
  initScene: function () {
    this.addListeners();
    var size = this.getWidthHeight();
    var scene = window.scene = this.scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2( "#b82601", 0.02 );
    this.initCamera(size);

    this.addHelpers();
    this.renderer = new THREE.WebGLRenderer({ alpha:true, antiAlias:false, canvas:this.canvasEl });
    this.renderer.setSize( size.w, size.h );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setClearColor( 0x000000, 0 );
    // this.renderer.shadowMapEnabled = true;
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.initControls();

    this.lightControls = new LightControls();
    this.resize();
    this.animate();
  },
  initCamera: function (size) {
    this.camera = new THREE.PerspectiveCamera( 75, size.w / size.h, 0.1, 1000 );
    this.camera.lookAt(new THREE.Vector3( 1, 10, 0 ));
  },
  initControls: function () {
    var cameraControls = new CameraControls({ camera:this.camera, canvasEl:this.canvasEl });
    this.sceneControls = new SceneControls({ camera:this.camera, canvasEl:this.canvasEl });
    this.controls = cameraControls.getControls();
  },
  addHelpers: function () {
    var axisHelper = new THREE.AxisHelper( 11 );
    // axisHelper.position.y = 40;
    this.scene.add( axisHelper );
  },
  addModelsToScene: function (sceneModelArray) {
    _.each(sceneModelArray, function (object3d) {
      this.scene.add(object3d);
    }, this);
  },
  removeModelsFromScene: function (modelArray) {
    _.each(modelArray, function (object3d) {
      this.scene.add(object3d);
    }, this);
  },
  animate: function (time) {
    raf( this.animate );
    this.statsView.stats.begin();
    TWEEN.update(time);
    this.controls.update(this.clock.getDelta());
		this.renderer.render(this.scene, this.camera);
    this.statsView.stats.end();
    if (this.videoObject) {
      if ( this.videoObject.video.readyState === this.videoObject.video.HAVE_ENOUGH_DATA )
      	{
      		this.videoObject.videoImageContext.drawImage( this.videoObject.video, 0, 0 );
      		if ( this.videoObject.videoTexture )
      			this.videoObject.videoTexture.needsUpdate = true;
      	}
    }
  },
  setRenderVideoTexture: function (videoObject) {
    this.videoObject = videoObject;
  },
  resize: function () {
    var size = this.getWidthHeight();
    this.camera.aspect = size.w / size.h;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( size.w, size.h );
    eventController.trigger(eventController.ON_RESIZE, size);
  },
  getWidthHeight: function () {
    return {w: this.$el.width(), h: this.$el.height() }
  },
  render: function () {
    this.statsView = new StatsView();
    // $("body").append(this.statsView.stats.domElement);
    // this.bodyEl = $("<div class='view-body-3d'></div>");
    this.$el.append(new SceneDetailControlsView().render().el);
    var canvasEl = $("<canvas>");
    this.$el.append(canvasEl);
    this.canvasEl = canvasEl[0];
    return this;
  }
});

module.exports = AppView3d;
