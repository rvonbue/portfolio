import utils from "../../util/utils";
var colorPallete = utils.getColorPallete();
var basePath = "textures/webDev/";

module.exports = {
  cityNight: {
    maps: [{ map: basePath + "cityNightAlt2.jpg" }],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: { shadingType: "MeshBasicMaterial" }
  },
  coinSlot: {
    maps: [{ map: basePath + "videoGameCabinet/coinSlot.png" }],
    mapProps: { repeatScale: 1, shading: "flat" },
  },
  computer: {
      maps: [
        { map: basePath + "computer/computer.jpg" }
      ],
      mapProps: { repeatScale: 1, shading: "flat" }
  },
  computerScreen1: {
      maps: [
        { map: basePath +  "computerScreen1.jpg" },
      ],
      mapProps: { repeatScale: 1, shading: "flat" }
  },
  computerScreen2: {
      maps: [
        { map: basePath + "computerScreen2.jpg" }
      ],
      mapProps: { repeatScale: 1, shading: "flat" }
  },
  keyboard: {
      maps: [
        { map: basePath + "computer/keyboard_COLOR.jpg" },
        // { specularMap: "textures/computer/keyboard_SPEC.jpg" },
        { normalMap: basePath + "computer/keyboard_NRM.jpg" }
      ],
      mapProps: { repeatScale: 1, shading: "smooth" },
  },
  woodFine: {
      maps: [
        { map: "textures/woodFine/woodFine_COLOR.jpg" },
        { specularMap: "textures/woodFine/woodFine_SPEC.jpg" },
        { normalMap: "textures/woodFine/woodFine_NRM.jpg" }
      ],
      mapProps: { repeatScale: 3, shading: "smooth" },
      // props: {color: colorPallete.lampLight.hex }
  },
  videoGameCabinet: {
    maps: [
      { map: basePath + "videoGameCabinet/videoGameCabinet_COLOR.jpg" },
      { specularMap: basePath + "videoGameCabinet/videoGameCabinet_SPECA.jpg" },
      // { normalMap: "textures/videoGameCabinet/videoGameCabinet_NRM.jpg" }
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
  },
  videoGameCabinetEmmisive: {
    maps: [
      { map: basePath + "videoGameCabinet/videoGameCabinetEmmisive.png" },
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
  },
  blackGlass: {
    // maps: [{ envMap: "webDev" } ],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: { color: "#FFFFFF", transparent: true, alwaysTransparent: true, opacityMax: 0.5, opacity: 0.1 }
  },
  fern:  {
    maps: [{ map: basePath + "fern.png" } ],
    mapProps: { repeatScale: 1, shading: "smooth" },
    props: { transparent: true, alwaysTransparent: true }
  },
  pot: {
    props: { color: "#e2725b" }
  },
  powerButton: {
      maps: [{ map: basePath + "computer/powerButton.jpg" } ],
      mapProps: { repeatScale: 1, shading: "flat" },
      props: { shadingType: "MeshBasicMaterial" }
  },
  rugPersianHalf: {
    maps:[
      { map: basePath + "rugPersianHalf_low.png" }
    ],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: { transparent: true, alwaysTransparent: true }
  },
  allBooks: {
    maps: [{ map: basePath + "allBooks.jpg" } ],
    mapProps: { repeatScale: 1, shading: "smooth" }
  }
};
