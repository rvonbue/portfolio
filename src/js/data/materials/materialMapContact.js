import utils from "../../util/utils";
var colorPallete = utils.getColorPallete();

module.exports = {
  concrete: {
    maps: [{ map: "textures/contact/concrete.jpg" }],
    mapProps: { repeatScale: 1, shading: "flat" },
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
  stucco2:{
    maps: [
      { map: "textures/stucco/stucco_COLOR.jpg" },
      { specularMap: "textures/stucco/stucco_SPEC.jpg" },
      { normalMap: "textures/stucco/stucco_NRM.jpg" }
    ],
    mapProps: { repeatScale: 4, shading: "flat" },
    props: {  color: "#FFFFFF" }
  },
  glass: {
    maps: [{ envMap: "basic" } ],
    mapProps: { repeatScale: 1, shading: "smooth" },
    props: { color: "#FFFFFF", transparent: true, alwaysTransparent: true, opacity:0.75}
  },
  chrome: {
    maps: [{ envMap: "basic" } ],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: { color: "#FFFFFF" }
  }
};
