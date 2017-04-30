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
      height: Math.abs(bounding.min.y) + Math.abs(bounding.max.y),
      depth: Math.abs(bounding.min.z) + Math.abs(bounding.max.z),
    };
  },
  getMeshCenterRadius: function (pos, bounding) {
    var center = _.clone(bounding.center);
    center.y += bounding.radius;
    pos.x += center.x;
    pos.y += center.y;
    pos.z += center.z;
    return pos;
  },
  getWorldLighting: function () {
    return {
      background: {
        cssSkyGradient: 5 // 0 - 23 is valid
      },
      hemisphere: {
        sky:"#9be2fe",
        ground: "#FFFFFF",
        intensity: 0.1

      },
      directional: {
        color: "#FFFFFF",
        intensity: 0.3, //0.3
        position: {x: 15, y: 50, z: 30}
      }
    };
  },
  getColorPallete: function () {
    return {
      color1: {hex: "#b5651d" }, //brown
      color2: {hex: "#B82601" },  //green
      color3: {hex: "#062f4f" },
      color4: {hex: "#813772" },
      lampLight: { color: "#B82601", colorEmissive: "#B82601"},  //red //663399 purple
      text: { color:"#0090FF", color2: "#00cece"  },

    };
  }
}
