import materialMapListJapan from "./materialMapJapan";
import materialMapGround from "./materialMapGround";
import materialMapListWebDev from "./materialMapWebDev";
import materialMapList3dAnimation from "./materialMap3dAnimation";
import materialMapListDigitalArt from "./materialMapDigitalArt";
import materialMapContact from "./materialMapContact";
import materialMapAboutMe from "./materialMapAboutMe";

var materialMapList = _.extendOwn(
  materialMapListJapan,
  materialMapGround,
  materialMapListWebDev,
  materialMapList3dAnimation,
  materialMapListDigitalArt,
  materialMapAboutMe,
  materialMapContact
);

module.exports = materialMapList;
