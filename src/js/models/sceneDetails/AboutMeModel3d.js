import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";
import eventController from "../../controllers/eventController";
import aboutMeData from "../../data/pageData/aboutMeData";
import canvas from "../../data/embeded3dModels/canvas.json";
import { Mesh, BoxGeometry, MeshBasicMaterial, MeshLambertMaterial, MeshFaceMaterial, Vector3 } from "three";

var AboutMe3d = SceneDetailsBaseModel3d.extend({
  defaults: _.extend({},SceneDetailsBaseModel3d.prototype.defaults,
    {
    name: "aboutMe",
    initialCameraPosition: { x:3, y: 0.25, z: 4},
    initialCameraTarget: { x:-2, y: 2.25, z: -2},
    pointLights: [
      {x: -2, y: 1.5, z: 1.5, color: "#FFFFFF", intensity: 1, distance: 5 },
      {x: -2, y: 1.5, z: -1.5, color: "#FFFFFF", intensity: 1, distance: 5 },
      {x: 1, y: 1.5, z: -2.5, color: "#FFFFFF", intensity: 1, distance: 5 }
    ],
    pillarPos: [
      { x: -5 , y:0, z: -1.5 },
      { x: -1.5, y:0, z: -5 }
    ],
    intialAmbientLights: {
      directional: { color: "#FFFFFF", intensity: 0.2 },  // color intensity,
      hemisphere: { groundColor: "#404040", skyColor: "#FFFFFF", intensity: 1 }  // skyColor, groundColor, intensity
    },
    modelUrls: ["sceneDetails", "pillar"],
  }),
  MAX_IMAGE_WIDTH: 4,
  MAX_IMAGE_HEIGHT: 2,
  initialize: function () {
    SceneDetailsBaseModel3d.prototype.initialize.apply(this, arguments);
  },
  addInteractiveObjects: function () {
    SceneDetailsBaseModel3d.prototype.addInteractiveObjects.apply(this, arguments);

    var interactiveObjects = [];
    var posterPos = {
      right:{
        startPos: { x: -5, y: 6, z: -6.17, tallest: 0 },
        boundary: { xMin: -5, xMax:7, yMin: 2, yMax: 6 }
      },
      left:{
        startPos: { x: -5.95, y: 6, z: -6.17, tallest: 0 },
        boundary: { zMin: -6.17, zMax: 6, yMin: 2, yMax: 6 }
      }
    };

    aboutMeData.forEach(function (d, i) {
      var posterMesh = this.getArtCanvas(i);
      if ( i % 2 === 0 ) {
        this.positionPosterRight(posterMesh, posterPos.right);
      } else {
        this.positionPosterLeft(posterMesh, posterPos.left.startPos, posterPos.left.boundary);
        posterMesh.rotation.y = Math.PI / 2;
      }
      interactiveObjects.push(posterMesh);
    }, this);

    this.set("interactiveObjects", interactiveObjects );
  },
  positionPosterLeft: function (posterMesh, startPos, boundary) {
    var boundingBox = posterMesh.geometry.boundingBox;
    var spacingWidth = .5;
    var spacingHeight = .25;

    var width = Math.abs(boundingBox.min.x) + Math.abs(boundingBox.max.x);
    var height = Math.abs(boundingBox.min.y) + Math.abs(boundingBox.max.y);
    var x = startPos.x ;

    var random = Math.random();
    var yVariance = random > 0.5 ? -random * spacingHeight : random * spacingHeight;
    var y = startPos.y + yVariance - (height / 2);
    var z = startPos.z + spacingWidth + (width / 2) ;

    if ( z < boundary.zMax) {
      startPos.z += width + spacingWidth;
      startPos.tallest = height > startPos.tallest ? height : startPos.tallest;
    } else {
      startPos.z = z = boundary.zMin + width / 2;
      startPos.y -= startPos.tallest;
      y = startPos.y - (height / 2);
      startPos.tallest = 0;
    }
    posterMesh.position.set(x,y,z);

  },
  positionPosterRight: function (posterMesh, posterPos) {
    var startPos = posterPos.startPos;
    var boundary = posterPos.boundary;
    var boundingBox = posterMesh.geometry.boundingBox;
    var spacing = .5;
    var spacingHeight = .25;

    var width = Math.abs(boundingBox.min.x) + Math.abs(boundingBox.max.x);
    var height = Math.abs(boundingBox.min.y) + Math.abs(boundingBox.max.y);

    var x = startPos.x + width / 2;
    var random = Math.random();
    var yVariance = random > 0.5 ? -random * spacingHeight : random * spacingHeight;
    var y = startPos.y + yVariance - (height / 2);
    var z = startPos.z;

    if ( x < boundary.xMax) {
      startPos.x += width + spacing;
      startPos.tallest = height > startPos.tallest ? height : startPos.tallest;
    } else {
      startPos.x = x = boundary.xMin + width / 2;
      startPos.y -= startPos.tallest;
      y = startPos.y - (height / 2);
      startPos.tallest = 0;
    }

    posterMesh.position.set(x,y,z);

  },
  loadSceneDetailModels: function (modelObj) {
    this.set("totalLoaded", this.get("totalLoaded") + 1);

    if (modelObj.name === "sceneDetails") {
      this.set("object3d", modelObj.object3d);
    } else if(modelObj.name === "pillar"){
      this.addPillars(modelObj.object3d);
    }

    this.allModelsLoaded();
  },
  addPillars: function (pillar1) {
    var interactiveObjects = this.get("interactiveObjects");;
    var pillar, textMesh;

    this.get("pillarPos").forEach( function (pillarPos, i) {
      if ( i === 0 ) pillar = pillar1;
      if ( i !== 0 ) pillar = pillar1.GdeepCloneMaterials();

      textMesh = this.getPillarText({ text: "JS", size: 0.5, height: 0.10 });
      textMesh.position.y = pillar.geometry.boundingBox.max.y;
      pillar.add(textMesh);
      interactiveObjects.push(pillar);
      pillar.position.set(pillarPos.x, pillarPos.y, pillarPos.z);

    }, this);

  },
  getArtCanvas: function (index) {
    var canvasSize = this.getCanvasSize(aboutMeData[index].dimensions);
    var geometry = new BoxGeometry( canvasSize.width, canvasSize.height , 0.1);
    var lMaterial = new MeshLambertMaterial();
    geometry.computeBoundingBox();
    var src = aboutMeData[index].src + aboutMeData[index].name + "." + aboutMeData[index].dimensions.type;
    var frontMaterial = commandController.request(commandController.LOAD_MATERIAL, src)
    var materials = [ lMaterial, lMaterial, lMaterial, lMaterial, frontMaterial, lMaterial ];

    return new Mesh( geometry, new MeshFaceMaterial( materials )  );
  },
  getPillarText: function (textVal) {
    return commandController.request(commandController.GET_TEXT_MESH, textVal);
  },
  getCanvasSize: function (size) {
    var maxWidth = this.MAX_IMAGE_WIDTH; // Max width for the image
    var maxHeight = this.MAX_IMAGE_HEIGHT;    // Max height for the image
    var ratio = 0;  // Used for aspect ratio
    var width = size.width;    // Current image width
    var height = size.height;  // Current image height
    var newWidth, newHeight;

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
