import utils from "../../util/utils";
var colorPallete = utils.getColorPallete();

module.exports = {
  cityNight: {
    maps: [{ map: "textures/cityNightAlt1.jpg" }],
    mapProps: { repeatScale: 1, shading: "flat" },
  },
  coinSlot: {
    maps: [{ map: "textures/videoGameCabinet/coinSlot.png" }],
    mapProps: { repeatScale: 1, shading: "flat" },
  },
  computer: {
      maps: [
        { map: "textures/computer.jpg" }
      ],
      mapProps: { repeatScale: 1, shading: "flat" },
  },
  computerScreen1: {
      maps: [
        { map: "textures/computerScreen.jpg" },
      ],
      mapProps: { repeatScale: 1, shading: "flat" },
  },
  computerScreen2: {
      maps: [
        { map: "textures/computerScreen.jpg" },
      ],
      mapProps: { repeatScale: 1, shading: "flat" },
  },
  keyboard: {
      maps: [
        { map: "textures/computer/keyboard.jpg" },
        // { specularMap: "textures/computer/keyboard_SPEC.jpg" },
        { normalMap: "textures/computer/keyboard_NRM.jpg" }
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
      { map: "textures/videoGameCabinet/videoGameCabinet_COLOR.jpg" },
      { specularMap: "textures/videoGameCabinet/videoGameCabinet_SPECA.jpg" },
      // { normalMap: "textures/videoGameCabinet/videoGameCabinet_NRM.jpg" }
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
  },
  videoGameCabinetEmmisive: {
    maps: [
      { map: "textures/videoGameCabinet/videoGameCabinetEmmisive.png" },
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
  },
  blackGlass: {
    maps: [{ envMap: "webDev" } ],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: { color: "#FFFFFF", transparent: true, alwaysTransparent: true, opacityMax: 0.5, opacity:0.5 }
  },
  fern:  {
    maps: [{ map: "textures/farn.png" } ],
    mapProps: { repeatScale: 1, shading: "smooth" },
    props: { transparent: true, alwaysTransparent: true }
  },
  pot: {
    props: { color: "#e2725b" }
  },
  powerButton: {
      maps: [{ map: "textures/computer/powerButton.jpg" } ],
      mapProps: { repeatScale: 1, shading: "flat" },
  },
  rugPersian: {
    maps:[
      { map: "textures/rugPersian.png" }
    ],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: { transparent: true, alwaysTransparent: true }
  },
  allBooks: {
    maps: [{ normalMap: "textures/allBooks.jpg" } ],
    mapProps: { repeatScale: 1, shading: "smooth" }
  }
  // metal: {
  //     maps: [{ normalMap: "textures/fabric/fabric_NRM.jpg" } ],
  //     mapProps: { repeatScale: 50, shading: "flat" },
  //     props: { color: "#713f12" }
  // },
};
