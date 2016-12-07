// import utils from "../../util/utils";
// var colorPallete = utils.getColorPallete();

module.exports = {
  plushRed :{
    maps: [
      // { map: "textures/fabric/fabric_COLOR.jpg" },
      { specularMap: "textures/fabric/fabric_SPEC.jpg" },
      { normalMap: "textures/fabric/fabric_NRM.jpg" }
    ],
    mapProps: { repeatScale: 8, shading: "flat" },
    props: {color: "#FF0000" }
  },
  goldFloralSeamless: {
    maps: [
      { map: "textures/3dAnimation/goldFloralSeamless/goldFloralSeamless.png" },
      // { normalMap: "textures/fabric/fabric_NRM.jpg" }
      // { specularMap: "textures/fabric/fabric_SPEC.jpg" },
    ],
    mapProps: { repeatScale: 1, shading: "flat" },
    // props: {color: "#FF0000" }
  },
  leather: {
    maps: [
      { map: "textures/leather/leather.jpg" },
  //     // { specularMap: "textures/leather/leather_SPEC.jpg" },
  //     // { normalMap: "textures/leather/leather_NRM.jpg" }
    ],
    mapProps: { repeatScale: 5, shading: "flat" },
    props: {
      color: "#FFFFFF",
    }
  },
  redCarpet: {
    maps: [
      { map: "textures/3dAnimation/redCarpet.jpg" },
      // { specularMap: "textures/leather/leather_SPEC.jpg" },
      // { normalMap: "textures/leather/leather_NRM.jpg" }
    ],
    mapProps: { repeatScale: 5, shading: "flat" },
      // props: {color: "#FF0000" }
  },
  wallTan: {
    props: { color: "#CCB68D", shadingType: "MeshLambertMaterial"}
  },
  movieLight: {
    maps: [
      { map: "textures/3dAnimation/movieLight.png" },
    ],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: {shadingType: "MeshBasicMaterial", emissiveIntensity: 0.8, color:"#FFFFFF", colorEmissive: "#FFFFFF"}
  }
};
