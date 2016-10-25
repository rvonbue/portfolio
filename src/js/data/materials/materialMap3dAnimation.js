// import utils from "../../util/utils";
// var colorPallete = utils.getColorPallete();

module.exports = {
  plasticBlack: {
    props: {color: "#000000" }
  },
  plushRed :{
    maps: [
      // { map: "textures/fabric/fabric_COLOR.jpg" },
      { specularMap: "textures/fabric/fabric_SPEC.jpg" },
      { normalMap: "textures/fabric/fabric_NRM.jpg" }
    ],
    mapProps: { repeatScale: 5, shading: "flat" },
    props: {color: "#FF0000" }
  }
};
