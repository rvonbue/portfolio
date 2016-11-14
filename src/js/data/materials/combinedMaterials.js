import materialMapListJapan from "./materialMapJapan";
import materialMapListWebDev from "./materialMapWebDev";
import materialMapList3dAnimation from "./materialMap3dAnimation";
import materialMapListDigitalArt from "./materialMapDigitalArt";
import materialMapContact from "./materialMapContact";

var materialMapList = _.extendOwn(
  materialMapListJapan,
  materialMapListWebDev,
  materialMapList3dAnimation,
  materialMapListDigitalArt,
  materialMapContact
);

module.exports = materialMapList;
