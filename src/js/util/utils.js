module.exports = {
  worldScale: 20,
  size: { width: null, height: null },
  translateWidthHeight: function(w, h) {
    return { width: w  / this.worldScale, height: h / this.worldScale };
  },
  getFontColor: function () {
    return { text: "#062f4f"};
  },
  getColorPallete: function () {
    return {
      color1: {hex: "#b5651d" }, //brown
      color2: {hex: "#008000" },  //green
      color3: {hex: "#008000" },  //green
      lampLight: {hex: "#fe3a08" }  //red //663399 purple
    };
  },
  getGetAnimationSpeed: function () {
    return {
      time: 500
    };
  }
}
