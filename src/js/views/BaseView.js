var BaseView = Backbone.View.extend({
  childViews: [],
  initialize: function(){
  var initializeContext = this;
    _.bindAll(this,
      "onAttach",
      "removeEventHandlers",
      "removeChildViewEventHandlers",
      "beforeRender",
      "render",
      "afterRender"
    );
    this.render = _.wrap(this.render, function(render) {
      initializeContext.beforeRender();
      render();
      initializeContext.afterRender();
      return initializeContext;
    });
  },
  beforeRender: function(){
    this.removeChildViewEventHandlers();
    this.childViews = [];
  },
  afterRender: function() {

  },
  onAttach: function() {
    _.each(this.childViews, function(childView){
      childView.onAttach();
    }, this);
  },
  removeEventHandlers: function() {
    this.removeChildViewEventHandlers();
  },
  removeChildViewEventHandlers: function() {
    _.each(this.childViews, function(childView){
      childView.removeEventHandlers();
    }, this);
  },
});

module.exports = BaseView;
