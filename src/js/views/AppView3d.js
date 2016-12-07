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
import LoadingBarView from "./components/LoadingBarView";
import LinkHighlighterView from "./components/LinkHighlighterView";
import HomeButtonView from "./components/HomeButtonView";

import StatsView from "./components/statsView";
// import { CSS3DRenderer, CSS3DObject, Scene } from 'css3drenderer';
// import css3drenderer from 'css3drenderer';
// console.log("THREE: ", THREE);
// console.log("THREE:css3drenderer ", css3drenderer);

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
    console.log("addListeners:AppView3d",this.renderLoop);
    eventController.on(eventController.ADD_MODEL_TO_SCENE, this.addModelsToScene);
    eventController.on(eventController.REMOVE_MODEL_FROM_SCENE, this.removeModelsFromScene);
    eventController.on(eventController.CSS_RENDERER, this.switchRenderer, this);
    $(window).on("resize", this.resize);
  },
  removeListeners: function () {
    console.log("removeListeners:AppView3d");
    eventController.off(eventController.ADD_MODEL_TO_SCENE, this.addModelsToScene);
    eventController.off(eventController.REMOVE_MODEL_FROM_SCENE, this.removeModelsFromScene);
    eventController.off(eventController.CSS_RENDERER, this.switchRenderer, this);
    $(window).off("resize", this.resize);
  },
  show: function () {
    BaseView.prototype.show.apply(this, arguments);
    this.animate();
  },
  hide: function () {
    BaseView.prototype.hide.apply(this, arguments);
    this.cancelAnimate();
  },
  cancelAnimate: function () {
    raf.cancel(this.renderLoop);
    this.renderLoop = null;
  },
  initScene: function () {
    this.addListeners();
    var size = this.getWidthHeight();
    this.scene = window.scene = new THREE.Scene();
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

    var newChildViews = [
      new CameraControls({ camera:this.camera, canvasEl:this.canvasEl }),
      new SceneControls({ camera:this.camera, canvasEl:this.canvasEl })
    ];

    this.controls = newChildViews[0].getControls();
    this.addChildViews(newChildViews);
  },
  initSceneLoader: function () {
    var sceneLoader = new SceneLoader();

    var newChildViews = [
      sceneLoader,
      new SceneSelector({ sceneModelCollection: sceneLoader.sceneModelCollection })
    ];

    this.addChildViews(newChildViews);
  },
  addChildViews: function (childViews) {
    this.childViews = this.childViews.concat(childViews);
  },
  addHelpers: function () {
    var axisHelper = new THREE.AxisHelper( 50 );
    axisHelper.position.y = 40;
    this.scene.add( axisHelper );
    // var size = 10;
    // var step = 1;
    //
    // var gridHelper = new THREE.GridHelper( size, step );
    // gridHelper.position.y = 20;
    // this.scene.add( gridHelper );
  },
  addModelsToScene: function (sceneModelArray) {
    _.each(sceneModelArray, function (object3d) {
      // console.log("object3d", object3d);
      // this.statsView.updateFaceCount(object3d);
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
    raf( this.animateCSS3DRenderer.bind(this) );
    // this.statsView.stats.begin();
    TWEEN.update(time);
    this.controls.update(this.clock.getDelta());
    this.css3DRenderer.render(this.css3dScene, this.camera2);
    // this.statsView.stats.end();
  },
  switchRenderer: function () {
    raf.cancel(this.renderLoop);
    this.css3dScene = new Scene();
    this.css3DRenderer = this.getCSS3DRenderer();
    this.animateCSS3DRenderer();
  },
  getCSS3DRenderer: function () {
    var renderer = new CSS3DRenderer();
    		renderer.setSize( window.innerWidth, window.innerHeight );
    		renderer.domElement.style.position = 'absolute';
    		renderer.domElement.style.top = 0;
    renderer.setSize( window.innerWidth, window.innerHeight );
    var element = this.getElement( 'G1YtpuA7XNs', 0, 0, 240, 0 );
    this.css3dScene.add( element );
    var size = this.getWidthHeight()
    this.camera2 = new THREE.PerspectiveCamera( 75, size.w / size.h, 0.1, 1000 );
    // this.camera2.position.set(200,200,200);
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    return renderer;
  },
  getElement: function ( id, x, y, z, ry ) {
    // var div = document.createElement( 'div' );
    //     div.style.width = '480px';
    //     div.style.height = '360px';
    //     div.style.backgroundColor = '#000';
    var iframeEl = document.createElement( 'iframe' );
        iframeEl.style.width = '480px';
        iframeEl.style.height = '360px';
        iframeEl.style.border = '0px';
        iframeEl.src = "https://www.youtube.com/embed/mFfe4ZRQOH8";

    // div.appendChild( iframe );
    var object = new CSS3DObject( iframeEl );
    object.position.set( x, y, z );
    object.rotation.y = ry;

    return object;
  },

  getWidthHeight: function () {
    return {w: this.$el.outerWidth(true), h: this.$el.outerHeight(true) }
  },
  resize: function () {
    var size = this.getWidthHeight();
    this.camera.aspect = size.w / size.h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( size.w, size.h );
    eventController.trigger(eventController.ON_RESIZE, size);
  },
  render: function () {
    this.statsView = new StatsView();
    $("body").append(this.statsView.render().el);
    this.childViews = [
      new SceneDetailControlsView(),
      new LoadingBarView(),
      new LinkHighlighterView(),
      new HomeButtonView(),
    ];

    this.childViews.forEach( function (view) {
      this.$el.append(view.render().el);
    }, this);

    var canvasEl = $("<canvas>");
    this.$el.append(canvasEl);
    this.canvasEl = canvasEl[0];
    return this;
  }
});

module.exports = AppView3d;
