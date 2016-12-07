import utils from "../../util/utils";
var colorPallete = utils.getColorPallete();
var path = "textures/contact/";


module.exports = {
  chrome: {
    maps: [{ envMap: "basic" } ],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: { color: "#FFFFFF" }
  },
  linkedIn: {
    maps: [{ map: path + "linkedIn.jpg" } ],
    mapProps: { repeatScale: 1, shading: "flat" },
    // props: { color: "#FFFFFF" }
  },
  metal: {
    // maps: [{ map: path + "linkedIn.jpg" } ],
    // mapProps: { repeatScale: 1, shading: "flat" },
    props: { shadingType: "MeshStandardMaterial" }
  },
};
