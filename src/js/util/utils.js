module.exports = {
  worldScale: 20,
  size: { width: null, height: null },
  translateWidthHeight: function(w, h) {
    return { width: w  / this.worldScale, height: h / this.worldScale };
  },
  getFontColor: function () {
    return { text: "#062f4f"};
  }
};
