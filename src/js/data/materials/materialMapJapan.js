import utils from "../../util/utils";
var colorPallete = utils.getColorPallete();

module.exports = {
  bannerLogo: {
    maps: [
      { map: "textures/bannerLogoAlt.png" }
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
    props: { transparent: false }
  },
  drywall: {
    props: { color: "#EAEAE2" }
  },
  lanternNew: {
    maps: [
      { map: "textures/lantern4.png" },
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
    props: {
      color: "#FFFFFF",
      transparent: true,
      alwaysTransparent: true,
   }
  },
  lampLightEmit: {
    maps: [
      { map: "textures/lanternRed_low.jpg"},
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
    props: {
      color: colorPallete.lampLight.color,
      specular: colorPallete.lampLight.color,
      emissive: colorPallete.lampLight.colorEmissive,
      emissiveIntensity: 0.2,
     }
  },
  gradient: {
    maps: [
      { map: "textures/gradient.jpg" }
    ],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: { transparent: false }
  },
  overheadLight: {
    props: {
    color: "#FFFFFF",
    emisssive: "#FFFFFF",
    shadingType: "MeshBasicMaterial"
   }
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
  stucco:{
    maps: [
      { map: "textures/stucco2/stucco_COLOR_low.jpg" },
      { specularMap: "textures/stucco2/stucco_SPEC_low.jpg" },
      { normalMap: "textures/stucco2/stucco_NRM_low.jpg" }
    ],
    mapProps: { repeatScale: 20, shading: "flat" },
    props: { color: "#FFFFFF" }
  },
  windowJapan: {
    maps: [
      { map: "textures//windowJapan/windowJapan_COLOR_low.jpg" },
      { normalMap: "textures/windowJapan/windowJapan_NRM_low.jpg" }
    ],
    mapProps: { repeatScale: 1, shading: "flat" }
  },
  woodFloor: {
    maps: [
      { map: "textures/woodFloor2/woodFloor_COLOR_low.jpg" },
      { normalMap: "textures/woodFloor2/woodFloor_NRM_low.jpg" },
      { specularMap: "textures/woodFloor2/woodFloor_SPEC_low.jpg" }
    ],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: { shininess: 10 }
  },
  woodBamboo:{
    maps: [
      { map: "textures/woodBamboo/woodBamboo_COLOR_low.jpg" },
      { normalMap: "textures/woodBamboo/woodBamboo_NRM_low.jpg" }
    ],
    mapProps: { repeatScale: 2, shading: "flat" },
    props: {
      // color: colorPallete.color3.hex,
      shininess: 95,
      // shadingType: "MeshBasicMaterial"
     }
  },
  woodBeamPrimary: {
      maps: [
        { map: "textures/woodBare/woodBare_COLOR_low.jpg" },
        { normalMap: "textures/woodBare/woodBare_NRM_low.jpg" }
      ],
      mapProps: { repeatScale: 10, shading: "flat" },
      props: {  color: colorPallete.color1.hex }
  },
  woodBeamSecondary: {
    maps: [
      { map: "textures/woodBare/woodBare_COLOR_low.jpg" },
      { normalMap: "textures/woodBare/woodBare_NRM_low.jpg" }
    ],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: { color: colorPallete.color2.hex }
  },

};
