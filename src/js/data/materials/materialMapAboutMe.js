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
  },
  fabricGold: {
    props: { color: "#ffcc00" }
  },
  displayGlass: {
    maps: [{ envMap: "basic" }],
    mapProps: { repeatScale: 1, shading: "flat" },
    props: { color: "#FFFFFF", transparent: true, alwaysTransparent: true, opacityMax: 0.2, opacity: 0.2 }
  },
  resume: {
    maps:[
      {map: "textures/resume.png" }
    ],
    mapProps: { repeatScale: 1, shading: "flat" },
  }
};
