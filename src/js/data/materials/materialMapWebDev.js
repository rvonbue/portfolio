import utils from "../../util/utils";
var colorPallete = utils.getColorPallete();

module.exports = {
  cityNight: {
    maps: [{ map: "textures/cityNightAlt1.jpg" }],
    mapProps: { repeatScale: 1, shading: "flat" },
  },
  computer: {
      maps: [
        { map: "textures/computer.jpg" }
      ],
      mapProps: { repeatScale: 1, shading: "flat" },
      // props: {color: colorPallete.lampLight.hex }
  },
  computerScreen: {
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
        { map: "textures/keyboard.jpg" },
        // { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
        // { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
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
      { map: "textures/videoGameCabinet/videoGameCabinet.png" },
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
  },
  videoGameCabinetEmmisive: {
    maps: [
      { map: "textures/videoGameCabinet/videoGameCabinetEmmisive.png" },
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
  }
};
