import BaseModel3d from "../BaseModel3d";

var SceneDetailsBaseModel3d = BaseModel3d.extend({
  defaults: {
    name: "Spinach",
    pointLights: new Array,
    initialCameraPosition: { x:0, y: 0, z: 0},
    initialCameraTarget: { x:0, y: 0, z: 0},
    intialAmbientLights:{
      ambient: ["#FFFFFF", 0], // color intensity
      directional: ["#FFFFFF", 0],  // color intensity,
      hemisphere: ["#404040", "#9BE2FE", 0.25]  // skyColor, groundColor, intensity
    },
  },
  initialize: function( options ) {
    BaseModel3d.prototype.initialize.apply(this, arguments);
    this.setInitialPosition(options.sceneModel);
    if (options.name) this.set("name", options.name);
  },
  setInitialPosition: function (sceneModel) {
    var y = sceneModel.get("object3d").position.y;
    this.get("object3d").position.y = y;
    this.parentToSceneModel(sceneModel);
  },
  parentToSceneModel: function (sceneModel) {
    sceneModel.get("object3d").add(this.get("object3d"));
  },
  showHide: function (tBool) {
    var selectedParent = this.get("sceneModel").get("selected");
    this.toggleSceneLights(tBool && selectedParent);
    this.get("object3d").visible = tBool && selectedParent;
  },
  toggleSceneLights: function (tBool) {
    _.each(this.get("sceneLights"), function (light) {
      light.visible = tBool;
    });
  },
  addSceneLights: function () {

  },
  getInteractive: function () {

  }

});

module.exports = SceneDetailsBaseModel3d;
