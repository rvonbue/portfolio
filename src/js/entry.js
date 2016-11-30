/* jshint -W079 */ //stop jquery reassignment from showing error
var view;
// import NoCanvasSupportTemplate from "./AppMainNoCanvas.html";

import $ from 'jquery';
window.$ = $;
window.jQuery = $;

import _ from "underscore";
window._ = _;

import Backbone from "backbone";
Backbone.$ = $;
window.Backbone = Backbone;
import Radio from "backbone.radio";
Backbone.Radio = Radio;
import THREE from "three";

import eventController from "./controllers/eventController";
import commandController from "./controllers/commandController";
import AppView from "./views/AppView";
import stylesheet from "../styles/index.less";

THREE.Object3D.prototype.GdeepCloneMaterials = function() { //TODO: where to move this in the code http://stackoverflow.com/questions/22360936/will-three-js-object3d-clone-create-a-deep-copy-of-the-geometry
        var object = this.clone( new THREE.Object3D(), false );

        for ( var i = 0; i < this.children.length; i++ ) {

            var child = this.children[ i ];
            if ( child.GdeepCloneMaterials ) {
                object.add( child.GdeepCloneMaterials() );
            } else {
                object.add( child.clone() );
            }

        }
        return object;
    };

THREE.Mesh.prototype.GdeepCloneMaterials = function( object, recursive ) {
  if ( object === undefined ) {
      object = new THREE.Mesh( this.geometry, this.material.clone() );
  }

  THREE.Object3D.prototype.GdeepCloneMaterials.call( this, object, recursive );

return object;
};

function isCanvasSupported () {
  var elem = document.createElement("canvas");
  return !!(elem.getContext && elem.getContext("2d"));
}
function startApp () {
  view = new AppView({});
}
$(function () {
  if (isCanvasSupported()) {
    startApp();
  } else {
    $("body").append(NoCanvasSupportTemplate);
    return;
  }
  $("body").append(view.render().el);
  view.initScene();

  window.eventController = eventController;
  window.commandController = commandController;

});
