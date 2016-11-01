import SceneDetailsBaseModel3d from "./SceneDetailsBaseModel3d";
import movieScreenJson from "../../data/embeded3dModels/movieScreen.json";
import { MeshBasicMaterial, Mesh, VideoTexture, LinearFilter, Texture, FRONTSIDE } from "three";

var AnimationModel3d = SceneDetailsBaseModel3d.extend({
  initialize: function () {
    SceneDetailsBaseModel3d.prototype.initialize.apply(this, arguments);
    this.set("name", "AnimationModel3dSceneDetails");
    this.set("initialCameraPosition", { x:0, y: -0.5, z: 8});
    this.set("initialCameraTarget", { x:0, y: 1, z: 0});
    this.set("pointLights", [
      {x: 6, y: 1, z: 2, color: "#FFFFFF", intensity: 1, distance: 2 },
      // {x: 6, y: 1, z: 6.5, color: "#FFFFFF", intensity: 2, distance: 2 },
      {x: -6, y: 1, z: 2, color: "#FFFFFF", intensity: 1, distance: 2 },
      // {x: -6, y: 1, z: 6.5, color: "#FFFFFF", intensity: 2, distance: 2 },
    ]);
    this.set("intialAmbientLights", {
      directional: ["#FFFFFF", 0],  // color intensity,
      hemisphere: ["#404040", "#FFFFFF", 0.09]  // skyColor, groundColor, intensity
    });
  },
  addInteractiveObjects: function (modelLoader) {
    this.set("interactiveObjects", [this.getMovieScreen(modelLoader)]);
  },
  getMovieScreen: function (modelLoader) {
    var model = modelLoader.parseJSON(movieScreenJson);
    var mesh = new Mesh( model.geometry, this.getVideoTexture()); //only one material on the door;
    mesh.position.y += this.get("parentScenePosition").y;
    return mesh;
  },
  getVideoTexture: function () {
    // create the video element
	var video = document.createElement( 'video' );
	// video.id = 'video';
	// video.type = ' video/ogg; codecs="theora, vorbis" ';
	video.src = "videos/california.mp4";
	video.load();  // must call after setting/changing source
	video.play();
  video.loop = true;
  console.log("video", video);

	var videoImage = document.createElement( 'canvas' );
	videoImage.width = 1280;
	videoImage.height = 720;

	var videoImageContext = videoImage.getContext( '2d' );
	// background color if no video present
	videoImageContext.fillStyle = '#000000';
	videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

	var videoTexture = new Texture( videoImage );
	videoTexture.minFilter = LinearFilter;
	videoTexture.magFilter = LinearFilter;

  this.set("video",  {
    video: video,
    videoImageContext: videoImageContext,
    videoTexture: videoTexture
  });
	return new MeshBasicMaterial( { map: videoTexture, overdraw: true } );
}
});

module.exports = AnimationModel3d;
