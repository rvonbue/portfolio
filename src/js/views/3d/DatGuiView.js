import eventController from "../../controllers/eventController";
import BaseView from "../BaseView";
import Dat from "dat-gui";
import utils from "../../util/utils";
var animationSpeed = utils.getAnimationSpeed().speed;

var DatGuiView = BaseView.extend({
  className: "dat-gui",
  initialize: function (options) {
    this.addListeners();
  },
  addListeners: function () {
    eventController.on(eventController.MOUSE_CLICK_SELECT_OBJECT_3D, this.loadMaterial, this);
    eventController.on(eventController.SCENE_MODEL_SELECTED, this.loadSceneGui, this);
  },
  loadMaterial: function ( raycastObject ) {

  },
  loadSceneGui: function ( sceneModel ) {
    console.log("SceneModel::", sceneModel);
    this.addLightControls(sceneModel.get("sceneDetails").get("sceneLights"));
    // this.addMaterials(sceneModel.getAllMaterials());
  },
  addWorldLights: function () {
    console.log("addWorldLights::", utils.getWorldLighting().background.cssSkyGradient);
    var worldLights = this.gui.addFolder("WorldLights");
        var cssSkyGradient = worldLights.add(utils.getWorldLighting().background, 'cssSkyGradient')
        .min(0)
        .max(23)
        .step(1)
        .name("CSS Background");

        cssSkyGradient.onChange(function(value) {
          // Fires on every change, drag, keypress, etc.
          eventController.trigger(eventController.UPDATE_SKY_GRADIENT, value);
          console.log("onChange", value);
        });
  },
  addSceneLights: function (ambientLights) {
    var ambientLightFolder = this.gui.addFolder("AmbientLights");
      var hemiLight = ambientLightFolder.addFolder("Hemi");
          hemiLight.addColor(ambientLights.hemisphere, "skyColor").listen();
          hemiLight.addColor(ambientLights.hemisphere, "groundColor").listen();
          hemiLight.add(ambientLights.hemisphere, "intensity", 0, 3).listen();

      var directionalLight = ambientLightFolder.addFolder("Directional");
          directionalLight.addColor(ambientLights.directional, "color").listen();
          directionalLight.add(ambientLights.directional, "intensity", 0, 3).listen();
  },
  addLightControls: function (lights) {
    var pointLights = this.gui.addFolder("PointLights");

    lights.forEach( function (light, i) {
      var lightFolder = pointLights.addFolder("light-" + i);
          lightFolder.addColor(light, "color");
          lightFolder.add(light, "intensity", 0, 3);
          lightFolder.add(light, "distance", 0, 10);
          lightFolder.add(light.position, "x", 0, 10);
          lightFolder.add(light.position, "y");
          lightFolder.add(light.position, "z");
    });
  },
  addMaterials: function (materials) {
    var matMainFolder = this.gui.addFolder("Materials");

    materials.forEach( function (mat, i) {
      var name = mat.name || "default";
      var matFolder = matMainFolder.addFolder(name + i);
          matFolder.addColor(mat, "color");
          matFolder.addColor(mat, "specular");
          matFolder.addColor(mat, "emissive");
          matFolder.add(mat, "shininess", 0, 100);
    });
//     .onChange(function(value) {
//   // Fires on every change, drag, keypress, etc.
// });

  },
  render: function () {
    this.gui = new Dat.GUI({ autoPlace: false });
    this.gui.open();
    this.$el = this.gui.domElement;
    this.addWorldLights();
    return this;
  }
});

module.exports = DatGuiView;
