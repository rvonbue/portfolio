// import eventController from "../controllers/eventController";
import BaseModel3d from "./BaseModel3d";
import utils from "../util/utils";

var SceneModel = BaseModel3d.extend({
  defaults: {
    "name": "Caesar_Salad",
    "object3d": null, // mesh of the building floor
    "text3d": null,  // mesh
    "selected": false,
    "hover": false,
    "ready": false,  //ready if sceneDetails are loaded
    "interactive": true,
    "doorsBool": false, // doors are close by default
    "doors": null,     //array of meshes
    "hoverLamps": null,     // array meshes
    "hoverLights": null,    // array of point lights
    "sceneDetails": null, // sceneDetailsModel
    "sceneLights": null    // array
  },
  initialize: function( options ) {
    BaseModel3d.prototype.initialize.apply(this, arguments);
    // this.showHide(false);
    // this.setFadeInMaterials(); 
    this.once("change:selected", this.loadSceneDetails);
    this.once("change:sceneDetails", function () {
      this.set("ready", true);
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
  reset: function (showHideBool) {

    this.set("selected", false);
    this.set("hover", false);
    this.resetAllMaterials();
    this.showHide(showHideBool);
  },
  onChangeSelected: function () {
    // this.toggleDoors();
    var selectedBool = this.get("selected");
    this.showHide(selectedBool)
    this.toggleHoverLights(selectedBool);
    // this.toggleTextVisiblilty(selectedBool);
  },
  onChangeHover: function () {
    if (this.get("selected")) return;
    this.toggleLampEmitMaterial();
    this.toggleHoverLights(this.get("hover"));
    this.toggleTextMaterial();
  },
  showHide: function (visBool) { // show = true
    visBool = visBool ? visBool : this.get("selected");
      this.get("object3d").visible = visBool;
      _.each(this.get("object3d").children, function (mesh) {
          if ( mesh.type === "Mesh" ) { // do not turn on lights
            mesh.visible = visBool;
          }
      });
      var sceneDetails = this.get("sceneDetails");
      if (sceneDetails) {
        sceneDetails.get("object3d").visible = visBool;
      }
  },
  getCameraPosition: function () {
    return this.get("ready") ? this.getCameraPositionLoaded() : this.getCameraPositionLoading();
  },
  getCameraPositionLoading: function () {
    var size = this.getSize();
    var object3d = this.get("object3d");
    return {
      target: {
        x: object3d.position.x,
        y: object3d.position.y,
        z: 0
      },
      camera: {
        x: object3d.position.x,
        y: object3d.position.y + ((size.h / 2) * .65),  //magic number to find where to place camera when zooming in on floor model should be erased if model is vertically symetric
        z: object3d.geometry.boundingBox.max.z
      }
    };
  },
  getCameraPositionLoaded: function () {
    var cameraPosition = this.getCameraPositionLoading();
    cameraPosition.camera.z -= 2;
    return cameraPosition;
  },
  getSize: function () {
    var object3d = this.get("object3d");
    var height = Math.abs(object3d.geometry.boundingBox.max.y) + Math.abs(object3d.geometry.boundingBox.min.y);
    var width = Math.abs(object3d.geometry.boundingBox.max.x) + Math.abs(object3d.geometry.boundingBox.min.x);
    var length = Math.abs(object3d.geometry.boundingBox.max.z) + Math.abs(object3d.geometry.boundingBox.min.z);
    return { w: width, h: height, l: length };
  },

  toggleDoors: function (doorBool) {
    if (this.get("doorsBool")) return;
    var doorWidth = 0.4;
    var totalDoors = this.get("doors").length;
    _.each(this.get("doors"), function (doorMesh, i) {
      if (doorBool) { // open door
        if (i < totalDoors / 2) {
          if (i === 0) this.moveDoor(doorMesh, doorWidth);
          if (i === 1) this.moveDoor(doorMesh, doorWidth * 2 );
        } else {
          if (i === 2) this.moveDoor(doorMesh, -doorWidth * 2 );
          if (i === 3) this.moveDoor(doorMesh, -doorWidth );
        }
      }
    }, this);
    this.set("doorsBool", true);
  },
  moveDoor: function (doorMesh, doorWidth) {
    doorMesh.position.x += doorWidth;
  },
  toggleTextVisiblilty:function () {
    this.get("text3d").visible = !this.get("selected");
  },
  toggleHoverLights: function (hoverBool) {
    _.each(this.get("hoverLights"), function (light) {
      light.visible = hoverBool;
    }, this);
  },
  setEmissiveMaterial: function (mat, r, g, b) {
    mat.emissive.r = r;
    mat.emissive.g = g;
    mat.emissive.b = b;
  },
  getLampLightMaterial: function () {
    return _.find(this.get("hoverLamps")[0].material.materials, function(item) {
        return item.name == "lampLightEmit";
    });
  },
  toggleLampEmitMaterial:function () {
    var mat = this.getLampLightMaterial();
    if (this.get("hover") === true ) {
      var lampLightRGB = utils.getColorPallete().lampLight.rgb;
      this.setEmissiveMaterial(mat, lampLightRGB.r, lampLightRGB.g, lampLightRGB.b);
    } else {
      this.setEmissiveMaterial(mat, 0, 0, 0);
    }
  },
  toggleTextMaterial: function () {
    var textMaterial = this.get("text3d").material;

    if (this.get("hover") === true ) {
      var textRGB = utils.getColorPallete().text.rgb;
      this.setEmissiveMaterial(textMaterial, textRGB.r, textRGB.g, textRGB.b );
    } else {
      this.setEmissiveMaterial(textMaterial, 0, 0, 0 );
    }
  },
  setFadeInMaterials:function () {
    _.each(this.getAllMaterials(), function (mat) {
      if (!mat.alwaysTransparent) mat.transparent = true;
      mat.opacity = 0;
    });
  },
  setSceneAsParent: function (mesh) {
    this.get("object3d").add(mesh);
  }
});

module.exports = SceneModel;
