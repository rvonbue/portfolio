import utils from "../../util/utils";
var colorPallete = utils.getColorPallete();

module.exports = {
  concrete: {
    maps: [{ map: "textures/contact/concrete.jpg" }],
    mapProps: { repeatScale: 1, shading: "flat" },
  },
  chrome: {
    // maps: [{ envMap: "default" }],
    // mapProps: { repeatScale: 1, shading: "flat" },
    // props: {color: "#000000"}
  },
  nighthawksGreenWood: {
      maps: [
        { map: "textures/woodBare/woodBare_COLOR.jpg" },
        { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
        // { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
      ],
      mapProps: { repeatScale: 3, shading: "flat" },
      props: {  color: colorPallete.color2.hex }
  },
  sign: {
    maps: [
      { map: "textures/sign.png" },
      // { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
      // { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
    ],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: {  transparent: true, alwaysTransparent: true }
  },
  yellowDiffuse: {
    props: { color: "#ECE78B" }
  },
  ground: {
    maps: [
      { map: "textures/ground/ground_COLOR.jpg" },
      { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
      { normalMap: "textures/ground/ground_NRM.jpg" }
    ],
    mapProps: { repeatScale: 10, shading: "smooth" },
    // props: {  color: colorPallete.color2.hex }
  },
  stucco2:{
    maps: [
      { map: "textures/stucco/stucco_COLOR.jpg" },
      { specularMap: "textures/stucco/stucco_SPEC.jpg" },
      { normalMap: "textures/stucco/stucco_NRM.jpg" }
    ],
    mapProps: { repeatScale: 4, shading: "flat" },
    // props: {  color: "#474747" }
  },
  glass: {
    maps: [{ envMap: "reflection" } ],
    mapProps: { repeatScale: 1, shading: "smooth" },
    props: { color: "#FFFFFF", transparent: true, alwaysTransparent: true, opacity:0.75}
  },
};
