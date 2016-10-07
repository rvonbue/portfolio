import Base3dView from "./Base3dView";
import eventController from "../../controllers/eventController";
import data from "../../data/roboto_regular.json";
import utils from "../../util/utils";
import THREE from "three";

var FloorView3d = Base3dView.extend({
  name: "home",
  initialize: function () {
    Base3dView.prototype.initialize.apply(this, arguments);
    _.bindAll(this, "addText");
    console.log("init FloorView3d", this);
  },
  addText: function () {
    var text3d = this.getText3d(this.model.get("name"));
    var object3d = this.model.get("object3d");
    text3d.position.z = object3d.geometry.boundingBox.max.z - text3d.geometry.boundingBox.max.z;
    text3d.position.y = -text3d.geometry.boundingBox.max.y / 2;
    text3d.position.x = -((text3d.geometry.boundingBox.max.x - text3d.geometry.boundingBox.min.x) / 2);
    object3d.add(text3d);
  },
  getText3d: function (text) {
    utils.getFontColor().text
    var myfont = new THREE.Font(data);
    var material = new THREE.MeshBasicMaterial({ color: utils.getFontColor().text });

    var	textGeo = new THREE.TextGeometry( text.toUpperCase(), {
      font: myfont,
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
  getBaseScene: function () {

  },
  loadInteractiveObjects: function () {

  }
});

module.exports = FloorView3d;
