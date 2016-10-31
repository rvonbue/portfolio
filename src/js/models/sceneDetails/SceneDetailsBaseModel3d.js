import BaseModel3d from "../BaseModel3d";

var SceneDetailsBaseModel3d = BaseModel3d.extend({
  defaults: {
    name: "Spinach",
    pointLights: new Array,
    parentScenePosition: { x:0, y: 0, z: 0},
    initialCameraPosition: { x:0, y: 0, z: 0},
    initialCameraTarget: { x:0, y: 0, z: 0},
    interactiveObjects: new Array,
    intialAmbientLights:{
      ambient: ["#FFFFFF", 0], // color intensity
      directional: ["#FFFFFF", 0],  // color intensity,
      hemisphere: ["#404040", "#9BE2FE", 0.1]  // skyColor, groundColor, intensity
    },
  },
  initialize: function( options ) {
    BaseModel3d.prototype.initialize.apply(this, arguments);
    this.setInitialPosition();
    if (options.name) this.set("name", options.name);
  },
  setInitialPosition: function (sceneModel) {
    var y = this.get("parentScenePosition").y;
    this.get("object3d").position.y = y;
  },
  showHide: function (tBool, selectedParentScene) {
    var showHideBool = tBool && selectedParentScene;
    _.each(this.getAllMeshes(), function (mesh) {
      mesh.visible = showHideBool;
    });
  },
  getAllMeshes: function () {
    return [...this.get("sceneLights"), ...this.get("interactiveObjects"), this.get("object3d") ];
  },
  addInteractiveObjects: function () {

  }
});

module.exports = SceneDetailsBaseModel3d;
