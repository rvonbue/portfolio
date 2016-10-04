/* jshint -W079 */ //stop jquery reassignment from showing error
var view, graphModel;
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

import eventController from "./controllers/eventController";
import commandController from "./controllers/commandController";
import AppView from "./views/AppView";

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
  view.onAttach();

  window.eventController = eventController;
  window.commandController = commandController;

});
