import utils from "../../util/utils";
var colorPallete = utils.getColorPallete();

module.exports = {
  roofTop: {
      maps: [
        { map: "textures/paintedWoodGreen/woodPlanksPainted_COLOR.jpg" },
        { specularMap: "textures/paintedWoodGreen/woodPlanksPainted_SPEC.jpg" },
        { normalMap: "textures/paintedWoodGreen/woodPlanksPainted_NRM.jpg" }
      ],
      mapProps: { repeatScale: 0.75, shading: "flat" }
  },
  roofLog: {
      maps: [{ map: "textures/paintedWoodGreen/woodPlanksPainted.jpg" }],
      mapProps: { repeatScale: 1, shading: "smooth" },
      props: { color: "#b5651d"}
  },
  woodBeamPrimary: {
      maps: [
        { map: "textures/woodBare/woodBare_COLOR.jpg" },
        { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
        { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
      ],
      mapProps: { repeatScale: 10, shading: "flat" },
      props: {  color: colorPallete.color1.hex }
  },
  woodBeamSecondary: {
    maps: [
      { map: "textures/woodBare/woodBare_COLOR.jpg" },
      { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
      { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
    ],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: { color: colorPallete.color2.hex }
  },
  stucco:{
    maps: [
      { map: "textures/stucco2/stucco_COLOR.jpg" },
      { specularMap: "textures/stucco2/stucco_SPEC.jpg" },
      { normalMap: "textures/stucco2/stucco_NRM.jpg" }
    ],
    mapProps: { repeatScale: 20, shading: "flat" },
    props: { color: "#FFFFFF" }
  },
  woodBamboo:{
    maps: [
      { map: "textures/woodBamboo/woodBamboo_COLOR.jpg" },
      { specularMap: "textures/woodBamboo/woodBamboo_SPEC.jpg" },
      { normalMap: "textures/woodBamboo/woodBamboo_NRM.jpg" }
    ],
    mapProps: { repeatScale: 2, shading: "flat" },
    props: {  color: colorPallete.color3.hex }
  },
  windowJapan: {
    maps: [
      { map: "textures//windowJapan/windowJapan_COLOR.jpg" },
      // { specularMap: "textures/windowJapan/windowJapan_SPEC.jpg" },
      { normalMap: "textures/windowJapan/windowJapan_NRM.jpg" }
    ],
    mapProps: { repeatScale: 1, shading: "flat" }
  },
  lampLight: {
    maps: [
      {map: "textures/characterJapan.png"}
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
    props: {  transparent: true, alwaysTransparent: true }
  },
  lanternNew: {
    maps: [
      {map: "textures/lantern4.png"},
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
    props: {
      color: "#FFFFFF",
      transparent: true,
      alwaysTransparent: true,
   }
  },
  lampLightEmit: {
    // maps: [
    //   {emissiveMap: "textures/lanternEmissiveMap.png"},
    // ],
    // mapProps: { repeatScale: 1, shading: "smooth" },
    props: {
      color: colorPallete.lampLight.color,
      specular: colorPallete.lampLight.color,
      emissive: colorPallete.lampLight.colorEmissive,
      emissiveIntensity: 0.2,
      // specular: colorPallete.lampLight.color,
     }
  },
  shutterJapan:{
     maps: [
      {
        map: "textures/japanShutter/japanShutter_COLOR.jpg",
        normalMap: "textures/japanShutter/japanShutter_NRM.jpg",
        // specularMap: "textures/japanShutter/japanShutter_SPEC.jpg",
      }
    ],
    mapProps: { repeatScale: 1, shading: "flat" },
  },
  woodFloor: {
    maps: [
      { map: "textures/woodFloor/woodFloor_COLOR.jpg" },
      { specularMap: "textures/woodFloor/woodFloor_SPEC.jpg" },
      { normalMap: "textures/woodFloor/woodFloor_NRM.jpg" }
    ],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: { specularCoef: 10 }
  },
  bannerLogo: {
    maps: [
      { map: "textures/bannerLogoAlt.png" }
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
    props: { transparent: false }
  },
  grass: {
    maps: [
      { map: "textures/grass256.jpg" }
    ],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: { transparent: false }
  },
  plasticBlack: {
    props: {
      color: "#24282a",
      // specular: colorPallete.lampLight.color
    }
  },
  plasticRed: {
    props: { color: "#FF0000" }
  },
  drywall: {
    props: { color: "#EAEAE2" }
  },
  overheadLight: {
    props: {
    color: "#FFFFFF",
    emisssive: "#FFFFFF",
    shading: "basic"
   }
 },
  gradient: {
    maps: [
      { map: "textures/gradient.jpg" }
    ],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: { transparent: false }
  },
};
