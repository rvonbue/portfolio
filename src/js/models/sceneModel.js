// import eventController from "../controllers/eventController";
import BaseModel3d from "./BaseModel3d";
import utils from "../util/utils";
import TWEEN from "tween.js";
import { Color } from "three";

var SceneModel = BaseModel3d.extend({
  defaults: {
    "name": "Caesar_Salad",
    "className": "myClass",
    "object3d": null, // mesh of the building floor
    "text3d": null,  // mesh
    "selected": false,
    "hover": false,
    "loading": false, //loading scene Details currently
    "ready": false,  //ready if sceneDetails are loaded
    "interactive": true,
    "doors": null,     //array of meshes
    "hoverLamps": null,     // array meshes
    "hoverLights": null,    // array of point lights
    "sceneDetails": null, // sceneDetailsModel
  },
  initialize: function( options ) {
    BaseModel3d.prototype.initialize.apply(this, arguments);
    this.showHide(false);
    this.once("change:sceneDetails", function () {
      this.set({ loading: true });
    });
  },
  addModelListeners: function () {
    this.on("change:selected", this.onChangeSelected);
    this.on("change:hover", this.onChangeHover);
  },
  removeModelListeners: function () {
    this.off("change:selected", this.onChangeSelected);
    this.off("change:hover", this.onChangeHover);
  },
  onChangeSelected: function () {

    var selectedBool = this.get("selected");

    this.showHide(selectedBool)
    this.toggleHoverLights(selectedBool);

  },
  onChangeHover: function () {

    if ( this.get("selected") ) return;

    this.toggleLampEmitMaterial( this.getLampLightMaterial() );
    this.toggleHoverLights( this.get("hover") );
    this.toggleTextMaterial( this.get("text3d").material );

  },
  reset: function (showHideBool) {
    this.set("selected", false);
    this.set("hover", false);
    this.resetAllMaterials();
    this.showHide(showHideBool);
    if (this.get("text3d")) this.toggleTextMaterial(this.get("text3d").material);
  },
  isReady: function () {
    return this.get("ready") && !this.get("loading");
  },
  setSelectedDelay: function (nBool, delay) {
    delay = delay || 500;
    var self = this;
    self.set({ selected: nBool }, { silent: true });
    setTimeout(function () {
      self.onChangeSelected();
    }, delay);
  },
  showHide: function (visBool, hideText) { // show = true
    visBool = visBool ? visBool : this.get("selected");
    var text3d = this.get("text3d");
    var sceneDetails = this.get("sceneDetails");


    this.get("object3d").visible = visBool;
    _.each(this.get("object3d").children, function (mesh) {
        if ( mesh.type === "Mesh"
          && mesh.rayCasterMesh !== false
          && (text3d && text3d.id !== mesh.id)
       ) {
          mesh.visible = visBool; // do not turn on lights or raycaster
        }
    });

    if ( text3d ) text3d.visible = hideText ? !hideText : visBool;
    if ( sceneDetails ) sceneDetails.showHide(visBool, this.get("selected"));

  },
  enteringScene: function () {
    this.toggleHoverLights(false);
  },
  getCameraPosition: function () {
    return this.isReady() ? this.getCameraPositionLoaded() : this.getCameraPositionLoading();
  },
  getCameraPositionLoading: function () {
    return { target: this.getCameraLoadingTarget(), camera: this.getCameraLoadingPosition() };
  },
  getCameraLoadingTarget: function () {
    var object3dPos = this.getPosition();
    return { x: object3dPos.x, y: object3dPos.y, z: 0 };
  },
  getCameraLoadingPosition: function () {
    var objPos = this.getPosition();
    var size = this.getSize();
    var maxZ = this.get("object3d").geometry.boundingBox.max.z;
    var distFromFront = 5;
    return { x: objPos.x, y: objPos.y + ((size.h / 2) * .65), z: maxZ + distFromFront };
  },
  getCameraPositionLoaded: function () {
    var cameraPositionLoading = this.getCameraPositionLoading();
    var sceneDetailsPosition = {
      target: _.clone(this.get("sceneDetails").get("initialCameraTarget")), // dont actually change these position just clone them ;)
      camera: _.clone(this.get("sceneDetails").get("initialCameraPosition"))
    };
    sceneDetailsPosition.target.y += cameraPositionLoading.target.y;
    sceneDetailsPosition.camera.y += cameraPositionLoading.camera.y;
    return sceneDetailsPosition;
  },
  getSize: function (mesh) {
    mesh = mesh ? mesh : this.get("object3d");
    var height = Math.abs(mesh.geometry.boundingBox.max.y) + Math.abs(mesh.geometry.boundingBox.min.y);
    var width = Math.abs(mesh.geometry.boundingBox.max.x) + Math.abs(mesh.geometry.boundingBox.min.x);
    var length = Math.abs(mesh.geometry.boundingBox.max.z) + Math.abs(mesh.geometry.boundingBox.min.z);
    return { w: width, h: height, l: length };
  },
  openDoors: function (doorBool) {
    this.fadeOutText();
    if (this.get("doorsBool")) return;

    var speed = 1000;
    var doorWidth = 2;

    _.each(this.get("doors"), function (doorMesh, i) {
      if ( i === 0 ) this.moveDoor(doorMesh, doorWidth / 2, speed );
      if ( i === 1 ) this.moveDoor(doorMesh, doorWidth, speed );
      if ( i === 2 ) this.moveDoor(doorMesh, -doorWidth, speed );
      if ( i === 3 ) this.moveDoor(doorMesh, -doorWidth / 2, speed );
    }, this);

    this.set("doorsBool", true);

    return speed;
  },
  moveDoor: function (doorMesh, doorWidth, speed) {
    var initPosX = doorMesh.position.x;
    var tween = new TWEEN.Tween(doorMesh.position)
    .to({x: initPosX + doorWidth}, 2000)
    .easing(TWEEN.Easing.Circular.Out)
    .interpolation(TWEEN.Interpolation.Bezier)
    .start();
  },
  fadeOutText:function () {
    this.fadeMaterial(this.get("text3d").material, 0, 1500);
  },
  toggleHoverLights: function (hoverBool) {
    _.each(this.get("hoverLights"), function (light) {
      light.visible = hoverBool;
    });
  },
  setEmissiveMaterial: function (mat, color) {
    mat.emissive = new Color(color);
  },
  getLampLightMaterial: function () {
    return _.find(this.get("hoverLamps")[0].material.materials, function(item) {
      return item.name === "lampLightEmit";
    });
  },
  toggleLampEmitMaterial:function (mat) {
    var hoverIntensity = this.get("hover") ? 1 : 0.5;
    mat.emissiveIntensity = hoverIntensity;
  },
  toggleTextMaterial: function (mat) {
    var textColor = this.get("hover") ? utils.getColorPallete().text.color2 : utils.getColorPallete().text.color;
    mat.emissive = new Color(textColor);
  },
  setFadeInMaterial:function (mat) {
      mat.opacity = 0;
      mat.transparent = true;
  },
  setFadeOutMaterial: function (mat) {
      mat.transparent = true;
      mat.opacity = 1;
  },
  fadeMaterials: function (opacityEnd, materials) {
    var allMaterials = materials ? materials : this.getAllMaterials();

    allMaterials.forEach(function (mat) {
      this.fadeMaterial(mat, opacityEnd, utils.getAnimationSpeed().materialsFade);
    }, this);

  },
  fadeMaterial: function (mat, opacityEnd, tweenSpeed) {
    var newOpacityEnd = mat.opacityMax ? mat.opacityMax : opacityEnd;
    newOpacityEnd === 0 ? this.setFadeOutMaterial(mat) : this.setFadeInMaterial(mat);

    var tween = new TWEEN.Tween(mat)
        .easing(TWEEN.Easing.Circular.Out)
        .interpolation(TWEEN.Interpolation.Bezier)
        .to({ opacity: newOpacityEnd }, tweenSpeed)
        .onComplete(function () {
          if ( opacityEnd === 1  && !mat.alwaysTransparent ) {
            mat.transparent = false;
          } else if (opacityEnd === 0) {
            // self.set({ selected: false });
          }
        })
        .start();
  },
  getAmbientLighting: function () {
    return this.get("sceneDetails") ? this.get("sceneDetails").get("intialAmbientLights") : null;
  },
  setSceneAsParent: function (mesh) {
    this.get("object3d").add(mesh);
  },
  hideOutsideDetails: function () {
    this.get("text3d").visible = false;
    this.get("object3d").visible = false;
  }
});

module.exports = SceneModel;
