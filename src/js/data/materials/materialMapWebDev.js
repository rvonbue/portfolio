import utils from "../../util/utils";
var colorPallete = utils.getColorPallete();

module.exports = {
  cityNight: {
    maps: [{ map: "textures/webDev/cityNightAlt1.jpg" }],
    mapProps: { repeatScale: 1, shading: "flat" },
  },
  coinSlot: {
    maps: [{ map: "textures/webDev/videoGameCabinet/coinSlot.png" }],
    mapProps: { repeatScale: 1, shading: "flat" },
  },
  computer: {
      maps: [
        { map: "textures/webDev/computer/computer.jpg" }
      ],
      mapProps: { repeatScale: 1, shading: "flat" },
  },
  // computerScreen1: {
  //     maps: [
  //       { map: "textures/computerScreen.jpg" },
  //     ],
  //     mapProps: { repeatScale: 1, shading: "flat" },
  // },
  // computerScreen2: {
  //     maps: [
  //       { map: "textures/computerScreen.jpg" },
  //     ],
  //     mapProps: { repeatScale: 1, shading: "flat" },
  // },
  keyboard: {
      maps: [
        { map: "textures/webDev/computer/keyboard_COLOR.jpg" },
        // { specularMap: "textures/computer/keyboard_SPEC.jpg" },
        { normalMap: "textures/webDev/computer/keyboard_NRM.jpg" }
      ],
      mapProps: { repeatScale: 1, shading: "smooth" },
  },
  woodFine: {
      maps: [
        { map: "textures/woodFine/woodFine_COLOR.jpg" },
        { specularMap: "textures/woodFine/woodFine_SPEC.jpg" },
        { normalMap: "textures/woodFine/woodFine_NRM.jpg" }
      ],
      mapProps: { repeatScale: 1, shading: "smooth" },
      // props: {color: colorPallete.lampLight.hex }
  },
  videoGameCabinet: {
    maps: [
      { map: "textures/webDev/videoGameCabinet/videoGameCabinet_COLOR.jpg" },
      { specularMap: "textures/webDev/videoGameCabinet/videoGameCabinet_SPECA.jpg" },
      // { normalMap: "textures/videoGameCabinet/videoGameCabinet_NRM.jpg" }
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
  },
  videoGameCabinetEmmisive: {
    maps: [
      { map: "textures/webDev/videoGameCabinet/videoGameCabinetEmmisive.png" },
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
  },
  blackGlass: {
    maps: [{ envMap: "webDev" } ],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: { color: "#FFFFFF", transparent: true, alwaysTransparent: true, opacityMax: 0.5, opacity:0.5 }
  },
  fern:  {
    maps: [{ map: "textures/webDev/fern.png" } ],
    mapProps: { repeatScale: 1, shading: "smooth" },
    props: { transparent: true, alwaysTransparent: true }
  },
  pot: {
    props: { color: "#e2725b" }
  },
  powerButton: {
      maps: [{ map: "textures/webDev/computer/powerButton.jpg" } ],
      mapProps: { repeatScale: 1, shading: "flat" },
  },
  rugPersian: {
    maps:[
      { map: "textures/webDev/rugPersian.png" }
    ],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: { transparent: true, alwaysTransparent: true }
  },
  allBooks: {
    maps: [{ map: "textures/webDev/allBooks.jpg" } ],
    mapProps: { repeatScale: 1, shading: "smooth" }
  }
};
