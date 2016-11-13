module.exports = {
  worldScale: 20,
  size: { width: null, height: null },
  getAnimationSpeed: function () {
    return { materialsFade: 500, cameraMove: 500, speed: 1000 };
  },
  translateWidthHeight: function(w, h) {
    return { width: w  / this.worldScale, height: h / this.worldScale };
  },
  getFontColor: function () {
    return { text: "#062f4f" };
  },
  getColorPallete: function () {
    return {
      color1: {hex: "#b5651d" }, //brown
      color2: {hex: "#008000" },  //green
      color3: {hex: "#008000" },  //green
      lampLight: {hex: "#B82601", rgb: { r:0.72, g:0.15, b: 0.005 } },  //red //663399 purple
      text: { hex:"#062f4f", rgb: { r:0.024, g:0.184, b: 0.31 } },
      world: {
        hemisphere: {
          sky:"#9be2fe",
          ground: "#9be2fe",
          intensity: 0.15
        },
        directional: {
          color: "#9be2fe",
          intensity: 0.75
        }
      }
    };
  }
}
