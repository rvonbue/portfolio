import SceneModel from "../models/sceneModel";

var SceneModelCollection = Backbone.Collection.extend({
  model: SceneModel
});

module.exports = SceneModelCollection;
