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
    var width = this.$el.width();
    var height = window.innerHeight - this.$el.find(".navigation-bar:first").height();
    console.log("height:", height);
    var scene = window.scene = this.scene = new THREE.Scene();
    this.initCamera();
    this.lightLoader = new LightLoader({scene: scene});
    this.addHelpers();
    this.renderer = new THREE.WebGLRenderer({alpha: false, antiAlias: true, canvas: this.canvasEl });
    this.renderer.setSize( width, height );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.initControls();
    this.addListeners();
    this.animate();
  },
  initCamera: function () {
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    eventController.trigger(eventController.ADD_DAT_GUI_CONTROLLER,{ arr: [this.camera.position], key: "x", name:"x" });
    eventController.trigger(eventController.ADD_DAT_GUI_CONTROLLER,{ arr: [this.camera.position], key: "y", name:"y" });
    eventController.trigger(eventController.ADD_DAT_GUI_CONTROLLER,{ arr: [this.camera.position], key: "z", name:"z" });
  },
  initControls: function () {
    var cameraControls = new CameraControls({ camera: this.camera, sceneObjects: this.sceneObjects, canvasEl: this.canvasEl });
    this.sceneControls = new SceneControls({ sceneObjects: this.sceneObjects });
    this.controls = cameraControls.getControls();
  },
  addHelpers: function () {
    var axisHelper = new THREE.AxisHelper( 25 );
    this.scene.add( axisHelper );
  },
  addModelsToScene: function (sceneModel) {
    console.log("addModelsToScene: sceneModel", sceneModel);
    this.scene.add(sceneModel.get("object3d"));
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
    var innerWidth = this.$el.width();
    var innerHeight = window.innerHeight - this.$el.find(".navigation-bar:first").height();

    this.camera.aspect = innerWidth / innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize( innerWidth, innerHeight );
  },
  render: function () {
    console.log("Appview Render");
    this.statsView = new StatsView();
    $("body").append(this.statsView.stats.domElement);
    this.$el.append(new NavigationBar().render().el);
    console.log("alkdsfjasldjf;sadklfjadskl;f", this.$el.append($("<canvas>")));
    this.canvasEl = this.$el.find("canvas")[0];
    // $("body").append(new DatGuiView().render().el);
    return this;
  }
});

module.exports = AppView;
