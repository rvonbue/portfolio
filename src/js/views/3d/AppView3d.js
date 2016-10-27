import BaseView from "../BaseView";
import THREE from "three";
import TWEEN from "tween.js";
import raf from "raf";
import eventController from "../../controllers/eventController";
import LightControls from "../controls/LightControls";
import CameraControls from "../../views/controls/cameraControls";
import SceneControls from "../../views/controls/sceneControls";
import StatsView from "../../views/3d/statsView";

var AppView3d = BaseView.extend({
  className: "appView-3d",
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    _.bindAll(this, "animate", "addModelsToScene", "resize");
    this.clock = new THREE.Clock();
  },
  addListeners: function () {
    eventController.on(eventController.ADD_MODEL_TO_SCENE, this.addModelsToScene);
    eventController.on(eventController.REMOVE_MODEL_FROM_SCENE, this.removeModelsFromScene);
    $(window).on("resize", this.resize);
  },
  removeListeners: function () {
    eventController.off(eventController.ADD_MODEL_TO_SCENE, this.addModelsToScene);
    eventController.off(eventController.REMOVE_MODEL_FROM_SCENE, this.removeModelsFromScene);
    $(window).off("resize", this.resize);
  },
  hide: function (parentEl) {
    this.$el.hide();
    this.removeListeners();
    parentEl.removeClass("threeD");
  },
  show: function (parentEl) {
    this.$el.show();
    this.addListeners();
    parentEl.addClass("threeD");
  },
  initScene: function () {
    var size = this.getWidthHeight();
    var scene = window.scene = this.scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2( "#b82601", 0.02 );
    this.initCamera(size);
    this.lightControls = new LightControls({ scene: scene });
    this.addHelpers();
    this.renderer = new THREE.WebGLRenderer({ alpha:true, antiAlias:false, canvas:this.canvasEl });
    this.renderer.setSize( size.w, size.h );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setClearColor( 0x000000, 0 );
    this.initControls();
    this.addListeners();
    this.animate();
  },
  initCamera: function (size) {
    this.camera = new THREE.PerspectiveCamera( 75, size.w / size.h, 0.1, 1000 );
    this.camera.lookAt(new THREE.Vector3( 1, 10, 0 ));
  },
  initControls: function () {
    var cameraControls = new CameraControls({ camera:this.camera, canvasEl:this.canvasEl });
    this.sceneControls = new SceneControls({ camera:this.camera, scene:this.scene, canvasEl:this.canvasEl });
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
  },
  resize: function () {
    var size = this.getWidthHeight();
    this.camera.aspect = size.w / size.h;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(  size.w, size.h );
    eventController.trigger(eventController.ON_RESIZE, size);
  },
  getWidthHeight: function () {
    return {w: window.innerWidth, h: this.$el.height() }
  },
  render: function () {
    this.statsView = new StatsView();
    $("body").append(this.statsView.stats.domElement);
    this.bodyEl = $("<div class='view-body-3d'></div>");
    this.$el.append(this.bodyEl);
    var canvasEl = $("<canvas>");
    this.bodyEl.append(canvasEl);
    this.canvasEl = canvasEl[0];
    // $("body").append(new DatGuiView().render().el);
    return this;
  }
});

module.exports = AppView3d;
