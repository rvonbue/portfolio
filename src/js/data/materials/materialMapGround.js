import utils from "../../util/utils";
var colorPallete = utils.getColorPallete();

module.exports = {
  ground: {
    maps: [
      { map: "textures/grass/grass_COLOR.jpg" },
      { specularMap: "textures/grass/grass_SPEC.jpg" },
      { normalMap: "textures/grass/grass_NRM.jpg" }
    ],
    mapProps: { repeatScale: 10, shading: "flat", shininess: 99 },
    // props: {  color: colorPallete.color2.hex }
  },
  hedge: {
    maps: [
      { map: "textures/grass/hedge1_COLOR.jpg" },
      { specularMap: "textures/grass/hedge1_SPEC.jpg" },
      // { normalMap: "textures/grass/hedge1_NRM.jpg" },
      { bumpMap: "textures/grass/hedge1_DISP.jpg" }
    ],
    mapProps: { repeatScale: 5, shading: "smooth" },
    props: { bumpScale:  0.4 }
  },
};