import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";
import eventController from "../../controllers/eventController";
import aboutMeData from "../../data/pageData/aboutMeData";
// import canvas from "../../data/embeded3dModels/canvas.json";
import { Mesh, BoxGeometry, MeshBasicMaterial, MeshLambertMaterial, MeshFaceMaterial, Vector3 } from "three";
import utils from "../../util/utils";

var AboutMe3d = SceneDetailsBaseModel3d.extend({
  defaults: _.extend({},SceneDetailsBaseModel3d.prototype.defaults,
    {
      name: "aboutMe",
      initialCameraPosition: { x:0, y: 0.25, z: 1.5},
      initialCameraTarget: { x:0, y: 2.25, z: -5},
      pointLights: [
        { x: -4, y: 3, z: -3, color: "#FFFFFF", intensity: 0.50, distance: 5 },
        { x: -0.5,  y: 3, z: -2, color: "#FFFFFF", intensity: 0.50, distance: 5 },
        { x: 4,  y: 3, z: -3, color: "#FFFFFF", intensity: 0.50, distance: 5 }
    ],
    pillar: [
      { x: -5, y: 0, z: -5.5, text: "JS" },
      { x: 5,  y: 0, z: -5.5, text: "CSS" }
    ],
    intialAmbientLights: {
      directional: { color: "#FFFFFF", intensity: 0.5 },  // color intensity,
      hemisphere: { groundColor: "#404040", skyColor: "#FFFFFF", intensity: 0.5 }  // skyColor, groundColor, intensity
    },
    modelUrls: ["sceneDetails", "pillar", "githubBanner", "glassCabinet"],
  }),
  MAX_IMAGE_WIDTH: 3, //world units
  MAX_IMAGE_HEIGHT: 1.75,
  initialize: function () {
    SceneDetailsBaseModel3d.prototype.initialize.apply(this, arguments);
  },
  addInteractiveObjects: function () {
    SceneDetailsBaseModel3d.prototype.addInteractiveObjects.apply(this, arguments);

    var interactiveObjects = [];
    var posterPos = { right:{
        startPos: { x: -9, y: 6.25, z: -6.17, tallest: 0 },
        boundary: { xMin: -9, yMax: 6.25, xMax: 9, yMin: 0 }
    }};

    aboutMeData.forEach(function (d, i) {
      var posterMesh = this.getArtCanvas(i);
      this.setClickData(posterMesh, d);
      this.positionPoster(posterMesh, posterPos.right);
      interactiveObjects.push(posterMesh);
    }, this);

    this.set("interactiveObjects", interactiveObjects );
  },
  setClickData: function (mesh, d) {
    mesh.clickData = {
      action: "link",
      url: d.linkUrl || "defualt----Link"
    }
  },
  positionPoster: function (posterMesh, posterPos) {
    var startPos = posterPos.startPos, boundary = posterPos.boundary;
    var size = utils.getMeshWidthHeight(posterMesh.geometry.boundingBox);
    var variance = this.getVariance();
    var x = startPos.x + variance + size.width / 2;
    var y = startPos.y + variance - (size.height / 2);


    if ( x + size.width / 2 < boundary.xMax) {
      startPos.x += size.width + variance;
      startPos.tallest = size.height > startPos.tallest ? size.height: startPos.tallest;
    } else {
      startPos.x = boundary.xMin + size.width + variance;
      startPos.y -= startPos.tallest !== 0 ? startPos.tallest + variance : size.height + variance;
      y = startPos.y;
      x = boundary.xMin + ( size.width / 2 )+ variance;
      startPos.tallest = 0;
    }
    posterMesh.position.set(x, y, startPos.z);
  },
  getVariance: function () {
    var max = 0.5, min = 0.3;
    var num = Math.random() * (max - min) + min;

    return num;
  },
  loadSceneDetailModels: function (modelObj) {
    this.set("totalLoaded", this.get("totalLoaded") + 1);

    switch(modelObj.name) {
      case "sceneDetails":
        this.set("object3d", modelObj.object3d );
        break;
      case "pillar":
        this.addPillars( modelObj.object3d );
        break;
      case "githubBanner":
        this.setClickData(modelObj.object3d, { linkUrl: "http://github.com/rvonbue" });
      default:
        this.get("interactiveObjects").push(modelObj.object3d);
    }

    this.allModelsLoaded();
  },
  addPillars: function (pillar1) {
    var pillar, textMesh;

    this.get("pillar").forEach( function (pillarD, i) {

      if ( i === 0 ) pillar = pillar1;
      if ( i !== 0 ) pillar = pillar1.GdeepCloneMaterials();

      textMesh = this.getPillarText({
        text: pillarD.text,
        size: 0.5,
        height: 0.10,
        boundingBox: pillar.geometry.boundingBox
      });

      pillar.position.set(pillarD.x, pillarD.y, pillarD.z);
      pillar.add(textMesh);
      this.get("interactiveObjects").push(pillar);
    }, this);

  },
  getArtCanvas: function (index) {
    var canvasSize = this.getCanvasSize(aboutMeData[index].dimensions);
    var geometry = new BoxGeometry( canvasSize.width, canvasSize.height , 0.1);
    var src = aboutMeData[index].src + aboutMeData[index].name + "." + aboutMeData[index].dimensions.type;
    var frontMaterial = commandController.request(commandController.LOAD_MATERIAL, src)
    var lMaterial = new MeshLambertMaterial();
    var materials = [ lMaterial, lMaterial, lMaterial, lMaterial, frontMaterial, lMaterial ];

    geometry.computeBoundingBox();
    return new Mesh( geometry, new MeshFaceMaterial( materials ) );
  },
  getPillarText: function (options) {
    var text3d = commandController.request(commandController.GET_TEXT_MESH, options);
    var size = utils.getMeshWidthHeight(text3d.geometry.boundingBox);
        text3d.position.x -= size.width / 2;
        text3d.position.y = options.boundingBox.max.y;

    return text3d;
  },
  getCanvasSize: function (size) {
    var maxWidth = this.MAX_IMAGE_WIDTH; // Max width for the image
    var maxHeight = this.MAX_IMAGE_HEIGHT;    // Max height for the image
    var ratio = 0;  // Used for aspect ratio
    var width = size.width;    // Current image width
    var height = size.height;  // Current image height
    var newWidth, newHeight;

    if (height === width) {
      return { width: 1.2, height: 1.2 }
    }
    // Check if the current width is larger than the max
    if (width > maxWidth) {
      ratio = maxWidth / width;   // get ratio for scaling image
      newWidth = maxWidth; // Set new width
      newHeight =  height * ratio;  // Scale height based on ratio
      height = height * ratio;    // Reset height to match scaled image
      width = width * ratio;    // Reset width to match scaled image
    }

    // Check if current height is larger than max
    if (height > maxHeight) {
       ratio = maxHeight / height; // get ratio for scaling image
       newHeight = maxHeight;   // Set new height
       newWidth =  width * ratio;    // Scale width based on ratio
       width = width * ratio;    // Reset width to match scaled image
       height = height * ratio;    // Reset height to match scaled image
    }
    return { width: newWidth, height: newHeight };
  }
});

module.exports = AboutMe3d;
