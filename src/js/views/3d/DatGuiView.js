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
    console.log("this.gui::", this.gui.__folders);
    if (this.gui.__folders[sceneModel.get('name')]) return;
    var sceneFolder = this.gui.addFolder(sceneModel.get('name'));
    this.addLightControls(sceneModel.get("sceneDetails").get("sceneLights"), sceneFolder);
    // this.addMaterials(sceneModel.getAllMaterials());
  },
  addWorldLightsControllers: function () {
    var worldFolder = this.gui.addFolder("WorldLights");
    var worldLighting = utils.getWorldLighting();

    this.addCSSGradientControls(worldFolder, worldLighting);
    this.addHemiLightControls(worldFolder, worldLighting);
    this.addDirectionalLightControls(worldFolder, worldLighting);
  },
  addCSSGradientControls: function (worldFolder, worldLighting) {
    worldFolder.add(worldLighting.background, 'cssSkyGradient')
      .min(0)
      .max(23)
      .step(1)
      .name("CSS Background")
      .onChange(function(value) {
        eventController.trigger(eventController.UPDATE_SKY_GRADIENT, value);
      });
  },
  addHemiLightControls: function (worldFolder, worldLighting) {
    worldFolder.addColor(worldLighting.hemisphere, 'sky')
      .name("Hemisphere Light: Sky")
      .onChange(function(value) {
        eventController.trigger(eventController.UPDATE_HEMISPHERE_LIGHT,
          { skyColor: value, lightType: "HemisphereLight" });
      });

    worldFolder.addColor(worldLighting.hemisphere, 'ground')
      .name("Hemisphere Light: Ground")
      .onChange(function(value) {
        eventController.trigger(eventController.UPDATE_HEMISPHERE_LIGHT,
          { groundColor: value, lightType: "HemisphereLight" });
      });

    worldFolder.add(worldLighting.hemisphere, "intensity")
      .step(0.05)
      .min(0)
      .max(0.75).onChange(function(value) {
        eventController.trigger(eventController.UPDATE_HEMISPHERE_LIGHT,
          { intensity: value, lightType: "HemisphereLight"});
      });
  },
  addDirectionalLightControls: function (worldFolder, worldLighting) {
    worldFolder.addColor(worldLighting.directional, 'color')
      .name("DirectionalLight")
      .onChange(function(value) {
        eventController.trigger(eventController.UPDATE_HEMISPHERE_LIGHT,
          { color: value, lightType: "DirectionalLight" });
      });

    worldFolder.add(worldLighting.directional, "intensity")
      .step(0.05)
      .name("DirectionalLight: Intensity")
      .min(0)
      .max(0.3).onChange(function(value) {
        eventController.trigger(eventController.UPDATE_HEMISPHERE_LIGHT,
          { intensity: value, lightType: "DirectionalLight"});
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
  addLightControls: function (lights, sceneFolder) {
    var pointLights = sceneFolder.addFolder("Point Lights");

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
    this.gui = new Dat.GUI({ autoPlace: false, width: 400 });
    this.gui.open();
    this.$el = this.gui.domElement;
    this.addWorldLightsControllers();
    return this;
  }
});

module.exports = DatGuiView;
