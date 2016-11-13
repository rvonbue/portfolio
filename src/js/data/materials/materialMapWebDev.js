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
      // props: {color: colorPallete.lampLight.hex }
  },
  computerScreen1: {
      maps: [
        { map: "textures/computerScreen.jpg" },
        // { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
        // { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
      ],
      mapProps: { repeatScale: 1, shading: "flat" },
      // props: {color: "#0000FF" }
  },
  computerScreen2: {
      maps: [
        { map: "textures/computerScreen.jpg" },
        // { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
        // { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
      ],
      mapProps: { repeatScale: 1, shading: "flat" },
      // props: {color: "#0000FF" }
  },
  keyboard: {
      maps: [
        { map: "textures/computer/keyboard.jpg" },
        // { specularMap: "textures/computer/keyboard_SPEC.jpg" },
        { normalMap: "textures/computer/keyboard_NRM.jpg" }
      ],
      mapProps: { repeatScale: 1, shading: "smooth" },
  },
  leather: {
      maps: [
        { map: "textures/leather.jpg" },
        // { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
        // { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
      ],
      mapProps: { repeatScale: 10, shading: "smooth" },
      // props: { color: colorPallete.lampLight.hex }
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
    props: { transparent: true, alwaysTransparent: true }
  }
};
