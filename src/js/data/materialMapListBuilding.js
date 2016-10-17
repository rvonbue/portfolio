module.exports = {
  woodFloor: {
    maps: [{ map: "textures/woodFloor/woodFloor_COLOR.jpg" }, { specularMap: "textures/woodFloor/woodFloor_SPEC.jpg" }, { normalMap: "textures/woodFloor/woodFloor_NRM.jpg" }],
    props: { repeatScale: 0.60, shading: "flat" },
  },
  brickWall: {
    maps: [{ map: "textures/brickWall/brickWall_COLOR.jpg" }, { specularMap: "textures/brickWall/brickWall_SPEC.jpg", normalMap: "textures/brickWall/brickWall_NRM.jpg" }],
    props: { repeatScale: 5},
  },
  marbleFloor: {
      maps: [{ map: "textures/marbleFloor/marbleFloor_COLOR.jpg" }, { specularMap: "textures/marbleFloor/marbleFloor_SPEC.jpg" }, { normalMap: "textures/marbleFloor/marbleFloor_NRM.jpg" }],
      props: { repeatScale: 1, shading: "flat" }
  },
  airCond: {
    maps: [{ map: "textures/airCond.jpg" }],
    props: { repeatScale: 0.15, shading: "flat" }
  },
  roof: {
      maps: [{ map: "textures/roof.jpg" }],
      props: { repeatScale: 0.25, shading: "flat" }
  },
  grass: {
    maps: [{ map: "textures/grass/grass.jpg" }],
    props: { repeatScale: 0.25, shading: "flat" }
  },
  girder: {
  },
  glass: {
    props: [{opacity: .25 }]
  }
};
