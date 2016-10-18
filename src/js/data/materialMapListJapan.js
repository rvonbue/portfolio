module.exports = {
  roofTop: {
      maps: [
        { map: "textures/paintedWoodGreen/woodPlanksPainted_COLOR.jpg" },
        { specularMap: "textures/paintedWoodGreen/woodPlanksPainted_SPEC.jpg" },
        { normalMap: "textures/paintedWoodGreen/woodPlanksPainted_NRM.jpg" }
      ],
      props: { repeatScale: 0.75, shading: "flat" }
  },
  roofLog: {
      maps: [{ map: "textures/paintedWoodGreen/woodPlanksPainted.jpg" }],
      props: { repeatScale: 0.25, shading: "smooth" }
  },
  woodBeamPrimary: {
      maps: [
        { map: "textures/woodBare/woodBare_COLOR.jpg" },
        { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
        { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
      ],
      props: { repeatScale: 10, shading: "flat" }
  },
  woodBeamSecondary: {
    maps: [
      { map: "textures/woodBare/woodBare_COLOR.jpg" },
      { specularMap: "textures/woodBare/woodBare_SPEC.jpg" },
      { normalMap: "textures/woodBare/woodBare_NRM.jpg" }
    ],
    props: { repeatScale: 4, shading: "flat" }
  },
  stucco:{
    maps: [
      { map: "textures/stucco/stucco_COLOR.jpg" },
      { specularMap: "textures/stucco/stucco_SPEC.jpg" },
      { normalMap: "textures/stucco/stucco_NRM.jpg" }
    ],
    props: { repeatScale: 20, shading: "flat" }
  },
  woodBamboo:{
    maps: [
      { map: "textures/woodBamboo/woodBamboo_COLOR.jpg" },
      { specularMap: "textures/woodBamboo/woodBamboo_SPEC.jpg" },
      { normalMap: "textures/woodBamboo/woodBamboo_NRM.jpg" }
    ],
    props: { repeatScale: 1, shading: "flat" }
  },
  windowJapan: {
    maps: [
      { map: "textures/windowJapan.jpg" },
    ],
    props: { repeatScale: 1, shading: "flat" }
  },
  lampLight: {
    maps: [
      {map: "textures/japan_character.png"}
    ],
    props: { repeatScale: 1, shading: "flat" }
  }
};
