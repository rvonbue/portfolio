import eventController from "../controllers/eventController";
import BaseModel from "./BaseModel";
import THREE from "three";
import roboto from "../data/roboto_regular.json";

var FontLoader = BaseModel.extend({
  initialize: function () {
    BaseModel.prototype.initialize.apply(this, arguments);
  },
  loadFont: function () {
    var fontLoader = new THREE.FontLoader();
    fontLoader.load("../path/to/font.json",function(tex){
    var  textGeo = new THREE.TextGeometry('Test', {
            size: 10,
            height: 5,
            curveSegments: 6,
            font: tex,
    });
  }
});

module.exports = FontLoader;
