import eventController from "../controllers/eventController";
import BaseView from "./BaseView";
import THREE from "three";
import TWEEN from "tween.js";
import raf from "raf";
import LightLoader from "../models/lightLoader";
import CameraControls from "../views/controls/cameraControls";
import SceneControls from "../views/controls/sceneControls";
import StatsView from "../views/3d/statsView";
// import DatGuiView from "../views/controls/datGuiView";
// require('three-first-person-controls')(THREE);

var AppView3d = BaseView.extend({
  className: "appView-3d",
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    _.bindAll(this, "animate", "addModelsToScene", "resize");
    this.clock = new THREE.Clock();
  },
  addListeners: function () {
    eventController.on(eventController.ADD_MODEL_TO_SCENE, this.addModelsToScene);
    $(window).on("resize", this.resize);
  },
  removeListeners: function () {
    eventController.off(eventController.ADD_MODEL_TO_SCENE, this.addModelsToScene);
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
    this.initCamera(size);
    this.lightLoader = new LightLoader({scene: scene});
    this.addHelpers();
    this.renderer = new THREE.WebGLRenderer({alpha: true, antiAlias: true, canvas: this.canvasEl });
    this.renderer.setSize( size.w, size.h );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setClearColor( 0x000000, 0 );
    this.initControls();
    this.addListeners();
    this.animate();
  },
  initCamera: function (size) {
    this.camera = new THREE.PerspectiveCamera( 75, size.w / size.h, 1, 1000 );
    this.camera.lookAt(new THREE.Vector3( 1, 10, 0 ));
  },
  initControls: function () {
    var cameraControls = new CameraControls({ camera:this.camera, canvasEl:this.canvasEl });
    this.sceneControls = new SceneControls({ camera:this.camera, scene:this.scene, parentEl:this.$el, canvasEl:this.canvasEl });
    this.controls = cameraControls.getControls();
  },
  addHelpers: function () {
    var axisHelper = new THREE.AxisHelper( 10 );
    this.scene.add( axisHelper );
  },
  addModelsToScene: function (sceneModelArray) {
    _.each(sceneModelArray, function (sceneModel) {
      this.scene.add(sceneModel.get("object3d"));
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
    var canvasEl = $("<canvas>");
    this.$el.append(canvasEl);
    this.canvasEl = canvasEl[0];
    // $("body").append(new DatGuiView().render().el);
    return this;
  }
});

module.exports = AppView3d;
