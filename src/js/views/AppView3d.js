import THREE from "three";
import TWEEN from "tween.js";
import raf from "raf";

import BaseView from "./BaseView";
import eventController from "../controllers/eventController";
import LightControls from "./3d/controls/LightControls";
import CameraControls from "./3d/controls/cameraControls";
import SceneControls from "./3d/controls/SceneControls";
import SceneLoader from "./3d/SceneLoader";
import SceneSelector from "./3d/SceneSelector";
import SceneDetailControlsView from "./3d/controls/SceneDetailControlsView";
import LinkHighlighterView from "./components/LinkHighlighterView";
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
    // scene.fog = new THREE.FogExp2( "#FFFFFF", 0.01 );
    this.initCamera(size);

    this.addHelpers();
    this.renderer = new THREE.WebGLRenderer({ alpha:true, antiAlias:false, canvas:this.canvasEl });
    this.renderer.setSize( size.w, size.h );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setClearColor( 0x000000, 0 );
    // this.renderer.shadowMapEnabled = true;
    // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.initControls();
    this.initSceneLoader();
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
  initSceneLoader: function () {
    var sceneLoader = new SceneLoader();
    var sceneSelector = new SceneSelector({ sceneModelCollection: sceneLoader.sceneModelCollection });
  },
  addHelpers: function () {
    var axisHelper = new THREE.AxisHelper( 50 );
    // axisHelper.position.y = 40;
    this.scene.add( axisHelper );
    var size = 10;
    var step = 1;

    var gridHelper = new THREE.GridHelper( size, step );
    gridHelper.position.y = 20;
    this.scene.add( gridHelper );
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
    this.renderLoop = raf( this.animate );
    this.statsView.stats.begin();
    TWEEN.update(time);
    this.controls.update(this.clock.getDelta());
		this.renderer.render(this.scene, this.camera);
    this.statsView.stats.end();
  },
  animateCSS3DRenderer: function (time) {
    this.renderLoop = raf( this.animateCSS3DRenderer );
    this.statsView.stats.begin();
    TWEEN.update(time);
    this.controls.update(this.clock.getDelta());
    this.CSS3DRenderer.render(this.scene, this.camera);
    this.statsView.stats.end();
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
  switchRenderer: function () {
    raf.cancel(this.renderLoop);
    this.CSS3DRenderer = this.getCSS3DRenderer();
    this.animateCSS3DRenderer();
  },
  getCSS3DRenderer: function () {
    var renderer = new THREE.CSS3DRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.top = 0;
    var group = new THREE.Group();
    group.add( new Element( 'G1YtpuA7XNs', 0, 0, 240, 0 ) );
    scene.add( group );
    return renderer;
  },
  getElement: function ( id, x, y, z, ry ) {
				var div = document.createElement( 'div' );
				div.style.width = '480px';
				div.style.height = '360px';
				div.style.backgroundColor = '#000';
				var iframe = document.createElement( 'iframe' );
				iframe.style.width = '480px';
				iframe.style.height = '360px';
				iframe.style.border = '0px';
				iframe.src = [ 'https://www.youtube.com/embed/', id, '?rel=0' ].join( '' );
				div.appendChild( iframe );
				var object = new THREE.CSS3DObject( div );
				object.position.set( x, y, z );
				object.rotation.y = ry;
				return object;

  },
  render: function () {
    this.statsView = new StatsView();
    // $("body").append(this.statsView.stats.domElement);
    this.$el.append(new SceneDetailControlsView().render().el);
    this.$el.append(new LinkHighlighterView().render().el);
    var canvasEl = $("<canvas>");
    this.$el.append(canvasEl);
    this.canvasEl = canvasEl[0];
    return this;
  }
});

module.exports = AppView3d;
