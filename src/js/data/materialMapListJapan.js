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
      mapProps: { repeatScale: 0.25, shading: "smooth" }
  },
  woodBeamPrimary: {
      maps: [
        { map: "textures/woodBare/woodBare_COLOR.jpg" },
        { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
        { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
      ],
      mapProps: { repeatScale: 10, shading: "flat" }
  },
  woodBeamSecondary: {
    maps: [
      { map: "textures/woodBare/woodBare_COLOR.jpg" },
      { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
      { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
    ],
    mapProps: { repeatScale: 4, shading: "flat" }
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
    props: {  color: colorPallete.color1.hex }
  },
  windowJapan: {
    maps: [
      { map: "textures/windowJapan.jpg" },
    ],
    mapProps: { repeatScale: 1, shading: "flat" }
  },
  lampLight: {
    maps: [
      {map: "textures/japan_character.png"}
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
    props: {  transparent: true }
  },
  lampLightEmit: {
    props: {
      color: colorPallete.lampLight.hex,
      emissive: colorPallete.lampLight.hex,
      specular: colorPallete.lampLight.hex,
     }
  },

};
