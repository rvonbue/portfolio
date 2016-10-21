import BaseView from "../BaseView";
import eventController from "../../controllers/eventController";
import navigationList from "../../data/navigationList";
import SceneModel from "../../models/sceneModel";
import SceneModelCollection from "../../collections/SceneModelCollection";
import utils from "../../util/utils";
import THREE from "three";
import TWEEN from "tween.js";
import fontData from "../../data/roboto_regular.json";
import door from "../../data/door.json";
import lampLight from "../../data/lampLight.json";
import ModelLoader from "../../models/modelLoader";

var HomeView = BaseView.extend({
  name: null,
  ready: false,
  TOTAL_MODELS: 0, // set in intialize function;
  TOTAL_MODELS_LOADED: 0,
  SCENE_MODEL_NAME: "floor",
  initialize: function (options) {
    BaseView.prototype.initialize.apply(this, arguments);
    this.sceneModelCollection = new SceneModelCollection();
    this.modelLoader = new ModelLoader();
    this.addListeners();
    var models = [
      { url: "models3d/floorJapan.json", name: this.SCENE_MODEL_NAME},
      { url: "models3d/japanBottomFloor.json", name: "bottomFloor" },
      { url: "models3d/ground.json", name: "ground" }
    ];
    this.TOTAL_MODELS = models.length;
    _.each(models, function (modelsArrObj) {
      eventController.trigger(eventController.LOAD_JSON_MODEL, modelsArrObj.url, { name: modelsArrObj.name }); //load scene Model
    });
  },
  addListeners: function () {
     eventController.on(eventController.MODEL_LOADED, this.modelLoaded, this );
     eventController.on(eventController.MOUSE_CLICK_SELECT_OBJECT_3D, this.clickSelectSceneModel, this);
     eventController.on(eventController.SWITCH_PAGE, this.navigationBarSelectSceneModel, this);
     eventController.on(eventController.CAMERA_FINISHED_ANIMATION, this.cameraFinishedAnimation, this);
     eventController.on(eventController.HOVER_NAVIGATION, this.setHoverSceneModel, this);
     eventController.on(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR, this.setHoverSceneModelNavBar, this);
     eventController.on(eventController.RESET_SCENE, this.resetScene, this);
  },
  removeListeners: function () {
    eventController.off(eventController.MODEL_LOADED, this.modelLoaded, this );
    eventController.off(eventController.MOUSE_CLICK_SELECT_OBJECT_3D, this.clickSelectSceneModel, this);
    eventController.off(eventController.SWITCH_PAGE, this.navigationBarSelectSceneModel, this);
    eventController.off(eventController.CAMERA_FINISHED_ANIMATION, this.cameraFinishedAnimation, this);
    eventController.off(eventController.HOVER_NAVIGATION, this.setHoverSceneModel, this);
    eventController.off(eventController.HOVER_SCENE_MODEL_FROM_NAV_BAR, this.setHoverSceneModelNavBar, this);
    eventController.off(eventController.RESET_SCENE, this.resetScene, this);
  },
  resetScene: function () {
    this.sceneModelCollection.each(function (sceneModel) {
      sceneModel.reset();
    });
    this.setInteractiveObjects();
  },
  setHoverSceneModel: function (intersect) {
    if (!intersect) {
      this.setAllHoverFalse();
      return;
    }
    this.setHoverSceneModelNavBar(intersect.object.name, true);
  },
  setHoverSceneModelNavBar: function (modelName, hoverBool) { // hoverBool = true when hover is true
    var newHoverModel = this.sceneModelCollection.findWhere({ name: modelName });
    if (this.hoverModel) {
      this.hoverModel.set("hover", false);
    }
    this.hoverModel = newHoverModel;
    newHoverModel.set("hover", hoverBool);
  },
  setAllHoverFalse: function () {
    _.each(this.sceneModelCollection.find({ hover: true }), function (sceneModel) {
      sceneModel.set("hover", false);
    });
    if (this.hoverModel) this.hoverModel = null;
  },
  clickSelectSceneModel: function (intersectObject) {
    if ( intersectObject ) var name = intersectObject.object.name;
    this.toggleSelectedSceneModel(name);
  },
  navigationBarSelectSceneModel: function (index) {
    if (isNaN(index)) return;
    this.toggleSelectedSceneModel(navigationList[index]);
  },
  toggleSelectedSceneModel: function (sceneModelName) {
    this.deselectSceneModel();
    var newSceneModel = this.sceneModelCollection.findWhere({ name: sceneModelName }).set({ selected: true });
    if ( newSceneModel ) {
      eventController.trigger(eventController.RESET_RAYCASTER, []);
      eventController.trigger(eventController.SCENE_MODEL_SELECTED, newSceneModel.get("object3d"));  //zoom to selected model
      this.hideEverythingNotSelected();
    }
  },
  deselectSceneModel: function () {
    var oldSceneModel = this.sceneModelCollection.findWhere({ selected: true});
    if ( oldSceneModel ) oldSceneModel.set("selected", false);
  },
  hideEverythingNotSelected: function () {
     var falseArr = this.sceneModelCollection.where({ selected: false });
    _.each(falseArr, function (sceneModel) {
      sceneModel.showHide(false);
    });
    // var falseArr = this.sceneModelCollection.where({ selected: false });
    // var self = this;
    // _.each(falseArr, function (sceneModel) {
    //   _.each(sceneModel.get("object3d").material.materials, function (mat) {
    //     self.fadeMaterial(mat, 0);
    //   });
    //   if(sceneModel.get("text3d")) self.fadeMaterial(sceneModel.get("text3d").material, 0);
    //
    // });
  },
  fadeMaterial: function (material, opacityEnd) {
    if ( opacityEnd === 0 )  material.transparent = true;

    var tween = new TWEEN.Tween(material)
    .to({ opacity: opacityEnd }, 500)
    .onComplete(function () {
      if ( opacityEnd === 1 ) {
        material.transparent = false;
      }
    })
    .start();
  },
  modelLoaded: function (obj) {
    if (obj.name === this.SCENE_MODEL_NAME) {
      this.sceneModelLoaded(obj);
    } else {
      this.addNonInteractive(obj);
    }

    ++this.TOTAL_MODELS_LOADED;
    this.checkAllModelsLoaded();
  },
  checkAllModelsLoaded: function () {
    console.log("checkAllModelsLoaded", this.TOTAL_MODELS_LOADED)
    if ( this.TOTAL_MODELS_LOADED === this.TOTAL_MODELS) {
      console.log("All models loaded");
    }
  },
  setInteractiveObjects: function () {
    var objects3d = this.sceneModelCollection.where({interactive: true}).map(function (model) {
      return model.get('object3d');
    });
    eventController.trigger(eventController.RESET_RAYCASTER, objects3d);
  },
  sceneModelLoaded: function (obj) {
    var object3d = obj.object3d;

    this.createFloors(object3d);
    var startingHeight = 7;
    var sceneModels = this.sceneModelCollection.where({ interactive: true });
    var object3dArr = [];
    // console.log("scene Models:", sceneModels);
    sceneModels.forEach(function (scModel, i) { // psoition floors on top of each other
      var object3d = scModel.get("object3d");
      var floorHeight =  Math.abs(object3d.geometry.boundingBox.max.y) + Math.abs(object3d.geometry.boundingBox.min.y);
      object3d.position.set(0, i * floorHeight + startingHeight, 0);
      object3dArr.push(object3d);
    });

    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, object3dArr);
    this.setInteractiveObjects();
  },
  createFloors: function (object3d) {
    _.each(navigationList.reverse(), function (floorName) {
      var sceneModel = new SceneModel({ name: floorName, object3d: object3d.GdeepCloneMaterials() });
      this.addText(sceneModel);
      this.addDoors(sceneModel);
      this.addLights(sceneModel);
      this.sceneModelCollection.add(sceneModel);
    }, this);
    navigationList.reverse();
  },
  selectFloor: function (closestObject) {
    if (closestObject) {
      this.selectedFloor = this.sceneModelCollection.findWhere({name: closestObject.object.name});
      this.selectedFloor.set("selected", true);
    } else if (this.selectedFloor) {
      this.selectedFloor.set("selected", false);
      this.selectedFloor = null;
    }
  },
  addText: function (sceneModel) {
    var text3d = this.getText3d(sceneModel.get("name"));
    var object3d = sceneModel.get("object3d");
    sceneModel.set("text3d", text3d);
    var offsetY = 0.7;
    text3d.position.z = object3d.geometry.boundingBox.max.z - text3d.geometry.boundingBox.max.z;
    text3d.position.y = (text3d.geometry.boundingBox.max.y + text3d.geometry.boundingBox.min.y) / 2 - offsetY;
    text3d.position.x = -((text3d.geometry.boundingBox.max.x - text3d.geometry.boundingBox.min.x) / 2);
    object3d.add(text3d);
  },
  getText3d: function (text) {
    var material = new THREE.MeshPhongMaterial({ color: utils.getFontColor().text });
    // material.emissive = new THREE.Color(utils.getFontColor().text);
    var	textGeo = new THREE.TextGeometry( text, {
      font: new THREE.Font(fontData),
      height: 0.5,
      size: 1.5,
      curveSegments: 4,
      bevelThickness: 2,
      bevelSize: 1.5,
      bevelSegments: 3
    });
    textGeo.computeBoundingBox();
    return new THREE.Mesh( textGeo, material );
  },
  addDoors: function (sceneModel) {
    var model = this.modelLoader.parseJSON(door);
    var mesh1 = new THREE.Mesh( model.geometry, model.materials[0]); //only one material on the door
    mesh1.geometry.computeBoundingBox();

    var meshArr = [mesh1];
    var doorWidth = (mesh1.geometry.boundingBox.max.x - mesh1.geometry.boundingBox.min.x);
    for(var i = 1; i < 4; i++) {  //build doors from right to left 4 doors total
      var meshClone = mesh1.clone();
      meshClone.position.x -= i * doorWidth;
      if ( i !== 3 ) {
        meshClone.position.z += 0.05;
      }
      meshArr.push(meshClone);
    }
    sceneModel.set("doors", meshArr);
    this.parentToSceneModel(meshArr, sceneModel);
  },
  addLights: function (sceneModel) {
    var model = this.modelLoader.parseJSON(lampLight);
    var mesh1 = new THREE.Mesh( model.geometry, new THREE.MultiMaterial(model.materials));
    var mesh2 = mesh1.clone();
    mesh2.position.x = 4;  // magic number but needs to be placed by hand
    sceneModel.set("hoverLamps", [mesh1, mesh2]);

    var light1 = this.getNewHoverLight(mesh1.position, 10, 3 );
    var light2 = this.getNewHoverLight(mesh2.position, 10, 3 )
    sceneModel.set("hoverLights", [light1, light2]);
    this.parentToSceneModel([mesh1, mesh2, light1, light2], sceneModel);
  },
  getNewHoverLight: function (pos, intensity, distance ) {
    var decay = 2;
    var color = utils.getColorPallete().lampLight.hex;
    var light = new THREE.PointLight( color, intensity, distance, decay );
    light.position.set( pos.x + 1, 1.5, 5.25 );  //TODO: magic numbers abound
    light.visible = false;
    return light;
  },
  parentToSceneModel: function (meshArray, sceneModel) {
    _.each(meshArray, function (mesh) {
      sceneModel.get("object3d").add(mesh);
    });
  },
  cameraFinishedAnimation: function () {
    console.log("cameraFinishedAnimation:");
    var selectedModel = this.sceneModelCollection.findWhere({ selected: true });
    console.log("selectedModel: :", selectedModel);
    selectedModel.toggleDoors(true);
  },
  addNonInteractive: function (obj) {
    obj.interactive = false;
    var sceneModel = this.sceneModelCollection.add(obj); //adding to collection returns sceneModel
    eventController.trigger(eventController.ADD_MODEL_TO_SCENE, [sceneModel.get("object3d")]);
  }
});

module.exports = HomeView;
