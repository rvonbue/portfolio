module.exports = {
  worldScale: 20,
  translateWidthHeight: function(w, h) {
    return { width: w  / this.worldScale, height: h / this.worldScale };
  }
};
