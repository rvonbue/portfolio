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
  asphalt: {
    // maps: [{ map: "textures/cityNightAlt1.jpg" }],
    // mapProps: { repeatScale: 1, shading: "flat" },
    props: {color: "#000000"}
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
  leather2: {
    maps: [
      { map: "textures/leather/leather_COLOR.jpg" },
      // { specularMap: "textures/leather/leather_SPEC.jpg" },
      { normalMap: "textures/leather/leather_NRM.jpg" }
    ],
    mapProps: { repeatScale: 5, shading: "smooth" },
    props: { color: "#4B0A03"}
  },
  sofaWood: {
    maps: [
      { map: "textures/woodBare/woodBare_COLOR.jpg" },
      { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
      // { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
    props: { color: "#4F0101"}
  },
  woodFloor2: {
    maps: [
      { map: "textures/woodFloor2/woodFloor_COLOR.jpg" },
      { specularMap: "textures/woodFloor2/woodFloor_SPEC.jpg" },
      { normalMap: "textures/woodFloor2/woodFloor_NRM.jpg" }
    ],
    mapProps: { repeatScale:10, shading: "flat" },
  },
  // glass: {
  //   maps: [{ envMap: "textures/cityNightAlt1.jpg" } ],
  //   mapProps: { repeatScale: 1, shading: "flat" },
  //   props: { transparent: true, alwaysTransparent: true, opacity: 0}
  // }
};
