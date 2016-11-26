module.exports = {
  worldScale: 20,
  size: { width: null, height: null },
  getAnimationSpeed: function () {
    return { materialsFade: 500, cameraMove: 1500, speed: 1000, lightOut: 3000 };
  },
  translateWidthHeight: function(w, h) {
    return { width: w  / this.worldScale, height: h / this.worldScale };
  },
  getFontColor: function () {
    return { text: "#062f4f" };
  },
  getMeshWidthHeight: function (bounding) {
    return {
      width: Math.abs(bounding.min.x) + Math.abs(bounding.max.x),
      height: Math.abs(bounding.min.y) + Math.abs(bounding.max.y)
    };
  },
  // getObjectPosition: function () {
  //
  // },
  getMeshCenterRadius: function (pos, bounding) {
    var center = _.clone(bounding.center);
    center.y += bounding.radius;
    pos.x += center.x;
    pos.y += center.y;
    pos.z += center.z;
    return pos;
  },
  getColorPallete: function () {
    return {
      color1: {hex: "#b5651d" }, //brown
      color2: {hex: "#B82601" },  //green
      color3: {hex: "#062f4f" },
      color4: {hex: "#813772" },
      lampLight: { color: "#B82601" },  //red //663399 purple
      text: { color:"#062f4f", color2: "#9be2fe"  },
      world: {
        hemisphere: {
          sky:"#9be2fe",
          ground: "#B82601",
          intensity: 0.1
        },
        background: {
          cssSkyGradient: 19 // 0 - 23 is valid
        },
        directional: {
          color: "#FFFFFF",
          intensity: 0.1,
          position: {x: -100, y: 50, z: 20}
        }
      }
    };
  }
}
