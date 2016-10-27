import BaseModel from "./BaseModel";
import utils from "../util/utils";

var BaseModel3d = Backbone.Model.extend({
  defaults: {
    "name": "Caesar_Salad",
    "object3d": null,
    "selected": false,
  },
  initialize: function( options ) {
    this.set("name", options.name);
    options.object3d.name = options.name;
    this.set("object3d", options.object3d);
    this.addModelListeners();
  },
  addModelListeners: function () {

  },
  removeModelListeners:function () {

  },
  reset: function () {
    this.set("selected", false);
  },
  getPosition: function () {
    var object3dPos = this.get("object3d").position;
    return { x: object3dPos.x, y: object3dPos.y, z: object3dPos.z };
  },
  getCameraPosition: function () {
    return this.getCameraPositionLoaded();
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
        y: object3d.position.y + ((size.h / 2) * .55),  //magic number to find where to place camera when zooming in on floor model should be erased if model is vertically symetric
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
  onChangeSelected: function () {

  },
  onChangeHover: function () {

  },
  getAllMaterials: function () {
    var object3d = this.get("object3d");
    var objectMaterialsArr = _.clone(object3d.material.materials);
    _.each(object3d.children, function (mesh) {
      if (!mesh.material) return; // if not a light
      if (mesh.material.materials) { // if mesh has multiple materials
        _.each(mesh.material.materials, function (mat) {
          if (mat.alwaysHidden) return; // if raycaster mesh dont alter those materials
          objectMaterialsArr.push(mat);
        });
      } else {
        objectMaterialsArr.push(mesh.material);
      }
    });
    return _.uniq(objectMaterialsArr, false); // remove duplicate materials
  },
  resetAllMaterials: function () {
    _.each(this.getAllMaterials(), function (mat) {
      if (!mat.alwaysTransparent) mat.transparent = false;
      mat.opacity = 1;
    });
  }
});

module.exports = BaseModel3d;
