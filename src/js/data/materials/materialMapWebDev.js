import utils from "../../util/utils";
var colorPallete = utils.getColorPallete();

module.exports = {
  computer: {
      maps: [
        { map: "textures/computer.jpg" },
        // { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
        // { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
      ],
      mapProps: { repeatScale: 1, shading: "smooth" },
      // props: {color: colorPallete.lampLight.hex }
  },
  computerScreen: {
      maps: [
        { map: "textures/computerScreen.jpg" },
        // { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
        // { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
      ],
      mapProps: { repeatScale: 1, shading: "flat" },
      props: {color: "0000FF" }
  },
  keyboard: {
      maps: [
        { map: "textures/keyboard.jpg" },
        // { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
        // { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
      ],
      mapProps: { repeatScale: 1, shading: "smooth" },
  },
  woodFine: {
      maps: [
        { map: "textures/woodFine/woodFine.jpg" },
        // { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
        // { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
      ],
      mapProps: { repeatScale: 1, shading: "smooth" },
      // props: {color: colorPallete.lampLight.hex }
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
};
