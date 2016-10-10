import eventController from "../controllers/eventController";
import BaseView from "./BaseView";
import THREE from "three";
import TWEEN from "tween.js";
import raf from "raf";
import LightLoader from "../models/lightLoader";
import CameraControls from "../models/cameraControls";
import SceneControls from "../views/controls/sceneControls";
import NavigationBar from "../views/navigationBar";
import StatsView from "../views/statsView";
// import DatGuiView from "../views/controls/datGuiView";
// require('three-first-person-controls')(THREE);

var AppView = BaseView.extend({
  className: "appview-container",
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
    _.bindAll(this, "animate", "addModelsToScene", "resize");
    this.sceneObjects = [];
    this.clock = new THREE.Clock();
  },
  addListeners: function () {
    eventController.on(eventController.ADD_MODEL_TO_SCENE, this.addModelsToScene);
    $(window).resize(this.resize);
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
    // eventController.trigger(eventController.ADD_DAT_GUI_CONTROLLER,{ arr: [this.camera.position], key: "x", name:"x" });
    // eventController.trigger(eventController.ADD_DAT_GUI_CONTROLLER,{ arr: [this.camera.position], key: "y", name:"y" });
    // eventController.trigger(eventController.ADD_DAT_GUI_CONTROLLER,{ arr: [this.camera.position], key: "z", name:"z" });
  },
  initControls: function () {
    var cameraControls = new CameraControls({ camera: this.camera, sceneObjects: this.sceneObjects, canvasEl: this.canvasEl });
    this.sceneControls = new SceneControls({ scene: this.scene, el: this.$el, camera: this.camera });
    this.controls = cameraControls.getControls();
  },
  addHelpers: function () {
    var axisHelper = new THREE.AxisHelper( 1 );
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
  },
  getWidthHeight: function () {
    return {w: this.$el.width(), h: window.innerHeight - this.$el.find(".navigation-bar:first").height() }
  },
  render: function () {
    this.statsView = new StatsView();
    $("body").append(this.statsView.stats.domElement);
    this.$el.append(new NavigationBar().render().el);
    this.$el.append($("<canvas>"));
    this.canvasEl = this.$el.find("canvas")[0];
    // $("body").append(new DatGuiView().render().el);
    return this;
  }
});

module.exports = AppView;
