import utils from "../util/utils";
var colorPallete = utils.getColorPallete();

console.log("colorPallete", colorPallete);
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
      { map: "textures/stucco/stucco_COLOR.jpg" },
      { specularMap: "textures/stucco/stucco_SPEC.jpg" },
      { normalMap: "textures/stucco/stucco_NRM.jpg" }
    ],
    mapProps: { repeatScale: 20, shading: "flat" }
  },
  woodBamboo:{
    maps: [
      { map: "textures/woodBamboo/woodBamboo_COLOR.jpg" },
      { specularMap: "textures/woodBamboo/woodBamboo_SPEC.jpg" },
      { normalMap: "textures/woodBamboo/woodBamboo_NRM.jpg" }
    ],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: {  color: colorPallete.color3.hex, shininess: 10 }
  },
  windowJapan: {
    maps: [
      { map: "textures/windowJapan.jpg" },
    ],
    mapProps: { repeatScale: 1, shading: "flat" }
  },
  lampLight: {
    maps: [
      {map: "textures/characterJapan.png"}
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
    props: {  transparent: true }
  },
  shutterJapan:{
     maps: [
    {map: "textures/japanShutter.jpg"}
  ],
  mapProps: { repeatScale: 1, shading: "flat" },
  },
  lampLightEmit: {
    props: {
      color: colorPallete.lampLight.hex,
      // emissive: colorPallete.lampLight.hex,
      // specular: colorPallete.lampLight.hex,
     }
  },
  woodFloor: {
    maps: [
      { map: "textures/woodFloor/woodFloor_COLOR.jpg" },
      { specularMap: "textures/woodFloor/woodFloor_SPEC.jpg" },
      { normalMap: "textures/woodFloor/woodFloor_NRM.jpg" }
    ],
    mapProps: { repeatScale: 1.5, shading: "flat" },
  },
  bannerLogo: {
    maps: [
      { map: "textures/bannerLogoAlt.png" }
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
    props: { transparent: false }
  }
};
