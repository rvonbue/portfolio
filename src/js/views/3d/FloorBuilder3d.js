import Base3dView from "./Base3dView";
import commandController from "../../controllers/commandController";
import THREE from "three";
import utils from "../../util/utils";
import door from "../../data/embeded3dModels/door.json";
import lampLight from "../../data/embeded3dModels/lampLight.json";

var FloorBuilder3d = Base3dView.extend({  //setups up all the outside lights and meshes for each individual floor
  initialize: function () {
    Base3dView.prototype.initialize.apply(this, arguments);
  },
  addFloorItems: function (sceneModel, modelLoader) {
    this.addText(sceneModel);
    this.addDoors(modelLoader, sceneModel);
    this.addLights(modelLoader, sceneModel);
    this.setRaycasterMesh(sceneModel);
  },
  addText: function (sceneModel) {
    var object3d = sceneModel.get("object3d");
    var offsetY = 1.3;
    var text3d = commandController.request(commandController.GET_TEXT_MESH , {
      text: sceneModel.get("name"),
      curveSegments: 4,
      size: 2.5,
      height: 0.75,
      bevelSegments: 3,
      bevelSize: 1.5,
      bevelThickness: 2,
      material: new THREE.MeshPhongMaterial({ color: utils.getColorPallete().text.hex })
    });
    sceneModel.set("text3d", text3d);


    text3d.position.z = object3d.geometry.boundingBox.max.z - text3d.geometry.boundingBox.min.z - 2;
    text3d.position.y = (text3d.geometry.boundingBox.max.y - text3d.geometry.boundingBox.min.y) / 2 - offsetY;
    text3d.position.x = -((text3d.geometry.boundingBox.max.x - text3d.geometry.boundingBox.min.x) / 2);

    object3d.add(text3d);
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
    var lampLightPos = {x:18, y: 3, z: 11, spacer: 7.2 };
    var model = modelLoader.parseJSON(lampLight);
    var meshArray =[new THREE.Mesh( model.geometry, new THREE.MultiMaterial(model.materials))];
    this.duplicateMesh(meshArray, sceneModel, _.clone(lampLightPos), 4, "hoverLamps");
    meshArray =[this.getNewHoverLight(20, 4)];
    var lampLightPos2 = _.clone(lampLightPos);
    // lampLightPos2.y -= 1;
    this.duplicateMesh(meshArray, sceneModel, lampLightPos2, 4, "hoverLights");
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
    light.visible = false;
    return light;
  },
  setRaycasterMesh: function (sceneModel) {
    var text3d = sceneModel.get("text3d");
    var size = sceneModel.getSize(text3d);
    var floorHeight = sceneModel.getSize();
    var geometry = new THREE.PlaneGeometry( size.w, floorHeight.h );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.FrontSide } );
    material.visible = false;
    material.alwaysHidden = true;
    var rayCasterMesh = new THREE.Mesh( geometry, material );
    rayCasterMesh.name = sceneModel.get("name");
    rayCasterMesh.position.y = size.h / 2;
    rayCasterMesh.position.z = text3d.position.z + (size.l * 1.1);
    rayCasterMesh.rayCasterMesh = false;
    sceneModel.set("rayCasterMesh", rayCasterMesh);
    this.parentToSceneModel([rayCasterMesh], sceneModel);
  },
  parentToSceneModel: function (meshArray, sceneModel) {
    _.each(meshArray, function (mesh) {
      sceneModel.get("object3d").add(mesh);
    });
  }
});

module.exports = FloorBuilder3d;
