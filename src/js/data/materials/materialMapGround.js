import utils from "../../util/utils";
var colorPallete = utils.getColorPallete();

module.exports = {
  ground: {
    maps: [
      { map: "textures/grass/grass.jpg" },
      // { specularMap: "textures/grass/grass_SPEC.jpg" },
      // { normalMap: "textures/grass/grass_NRM.jpg" }
    ],
    mapProps: { repeatScale: 10, shading: "flat", shininess: 75 },
    // props: {  color: colorPallete.color2.hex }
  },
  hedge: {
    maps: [
      { map: "textures/grass/hedge1_COLOR.jpg" },
      // { specularMap: "textures/grass/hedge1_SPEC.jpg" },
      // { normalMap: "textures/grass/hedge1_NRM.jpg" },
      { bumpMap: "textures/grass/hedge1_DISP.jpg" }
    ],
    mapProps: { repeatScale: 5, shading: "smooth" },
    props: { bumpScale:  0.4 }
  },
  moon: {
    maps: [
      { map: "textures/moon256x128.jpg" },
    ],
    mapProps: { repeatScale: 1, shading: "smooth", shininess: 15 },
    props: {
      // shadingType: "MeshBasicMaterial",
      // color: colorPallete.color2.hex,
      emissive: colorPallete.lampLight.colorEmissive,
      emissiveIntensity: 0.75,
     }
  },
};
