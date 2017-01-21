// import utils from "../../util/utils";
// var colorPallete = utils.getColorPallete();

module.exports = {
  digitalArt: {
      maps: [
        { map: "images/digitalArt/blender_cola.png" }
      ],
      mapProps: { repeatScale: 1, shading: "flat" },
      props: { transparent: true, opacity: 1 }
  },
  leather2: {
    maps: [
      { map: "textures/leather/leather_COLOR.jpg" },
      { specularMap: "textures/leather/leather_SPEC.jpg" },
      { normalMap: "textures/leather/leather_NRM.jpg" }
    ],
    mapProps: { repeatScale: 5, shading: "smooth" },
    props: {
      color: "#E0D6C7",
      "colorSpecular": [0.559829,0.559829,0.559829]
    }
  },
  button: {
    maps: [
      { map: "textures/leather/leather_COLOR.jpg" },
      { specularMap: "textures/leather/leather_SPEC.jpg" },
      { normalMap: "textures/leather/leather_NRM.jpg" }
    ],
    mapProps: { repeatScale: 5, shading: "smooth" },
    props: {
      color: "#bc9055",
      "colorSpecular": [0.559829,0.559829,0.559829]
    }
  },
  sofaWood: {
    maps: [
      { map: "textures/woodBare/woodBare_COLOR.jpg" },
      // { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
      // { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
    ],
    mapProps: { repeatScale: 5, shading: "smooth" },
    props: { color: "#1d1005"}
  },
  woodFloor2: {
    maps: [
      { map: "textures/woodFloor2/woodFloor_COLOR.jpg" },
      { specularMap: "textures/woodFloor2/woodFloor_SPEC.jpg" },
      { normalMap: "textures/woodFloor2/woodFloor_NRM.jpg" }
    ],
    mapProps: { repeatScale:10, shading: "flat" },
  },
  textureWall: {
    maps: [
      { map: "textures/wall.jpg" },
      // { specularMap: "textures/woodFloor2/woodFloor_SPEC.jpg" },
      // { normalMap: "textures/woodFloor2/woodFloor_NRM.jpg" }
    ],
    mapProps: { repeatScale:1, shading: "smooth" },
  },
  offWhite: {
    props: { color: "#FFFFFF"}
  },
  flowerYellow: {
    props: { color: "#fff747", shadingType: "MeshLambertMaterial"}
  },
  flowerGreen: {
    props: { color: "#4c8f00", shadingType: "MeshLambertMaterial"}
  },
  flowerWhite: {
    props: { color: "#FFFFFF", shadingType: "MeshLambertMaterial"}
  },
  vase: {
    maps: [
      { map: "textures/chinaBottleSeamless.png" }
    ],
    mapProps: { repeatScale: 2, shading: "smooth" },
  }
};
