var Base3dModel = Backbone.Model.extend({
  id: "",
  initialize: function () {
  },
  parseData: function (data) {

  },
  /* Handle nested models -  https://github.com/jashkenas/backbone/issues/483#issuecomment-2859029*/
  toJSON: function () {
    return JSON.parse(JSON.stringify(this.attributes));
  },
});

module.exports = Base3dModel;
