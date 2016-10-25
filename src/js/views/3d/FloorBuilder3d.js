import Base3dView from "./Base3dView";
// import eventController from "../../controllers/eventController";
import THREE from "three";
import fontData from "../../data/roboto_regular.json";
import utils from "../../util/utils";
import door from "../../data/door.json";
import lampLight from "../../data/lampLight.json";

var FloorBuilder3d = Base3dView.extend({  //setups up all the outside lights and meshes for each individual floor
  initialize: function () {
    Base3dView.prototype.initialize.apply(this, arguments);
  },
  addFloorItems: function (sceneModel, modelLoader) {
    this.addText(sceneModel);
    this.addDoors(modelLoader, sceneModel);
    this.addLights(modelLoader, sceneModel);
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
  addDoors: function (modelLoader, sceneModel) {
    var model = modelLoader.parseJSON(door);
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
  addLights: function (modelLoader, sceneModel) {
    var lampLightPos = {x:18, y: 3, z:10, spacer: 7.2 };
    var model = modelLoader.parseJSON(lampLight);
    var meshArray =[new THREE.Mesh( model.geometry, new THREE.MultiMaterial(model.materials))];
    this.duplicateMesh(meshArray, sceneModel, _.clone(lampLightPos), 4, "hoverLamps");
    meshArray =[this.getNewHoverLight(10, 3)];
    this.duplicateMesh(meshArray, sceneModel, _.clone(lampLightPos), 4, "hoverLights");
  },
  duplicateMesh: function (meshArray, sceneModel, startPosition, total, setModelProp) {
    for (var i = 0; i < total; i++ ) {
      if( i !== 0) meshArray.push(meshArray[0].clone());
      startPosition.x -= startPosition.spacer;
      meshArray[i].position.set(startPosition.x,startPosition.y, startPosition.z);
    }
    sceneModel.set(setModelProp, meshArray);
    this.parentToSceneModel(meshArray, sceneModel);
  },
  getNewHoverLight: function (intensity, distance ) {
    var decay = 2;
    var color = utils.getColorPallete().lampLight.hex;
    var light = new THREE.PointLight( color, intensity, distance, decay );
    // light.position.set( pos.x + 1, 1.5, 5.25 );  //TODO: magic numbers abound
    light.visible = false;
    return light;
  },
  parentToSceneModel: function (meshArray, sceneModel) {
    _.each(meshArray, function (mesh) {
      sceneModel.get("object3d").add(mesh);
    });
  }
});

module.exports = FloorBuilder3d;
