import utils from "../../util/utils";
var colorPallete = utils.getColorPallete();

module.exports = {
  poster: {
      maps: [
        { map: "textures/woodFine/woodFine_COLOR.jpg" },
        { specularMap: "textures/woodFine/woodFine_SPEC.jpg" },
        { normalMap: "textures/woodFine/woodFine_NRM.jpg" }
      ],
      mapProps: { repeatScale: 1, shading: "smooth" },
      // props: {color: colorPallete.lampLight.hex }
  }
};
