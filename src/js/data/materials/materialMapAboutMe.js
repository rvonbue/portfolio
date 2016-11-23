import utils from "../../util/utils";
var colorPallete = utils.getColorPallete();

module.exports = {
  pillarWhite: {
      props: {color: "#FFFFFF" }
  },
  github: {
    maps: [
      { map: "textures/github/github_COLOR.png" },
      { normalMap: "textures/github/github_NRM.png" }
    ],
    mapProps: { repeatScale: 1, shading: "smooth" },
    props: { color: "#FFFFFF", data: { link: "github.com/rvonbue" } }
  }
};
