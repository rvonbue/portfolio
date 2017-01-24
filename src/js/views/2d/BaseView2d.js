var BaseView2d = Backbone.View.extend({
  childViews: [],
  initialize: function(){
  },
  hide: function () {
    this.$el.fadeOut();
    // this.removeListeners();
  },
  show: function () {
    this.$el.fadeIn();
    // this.addListeners();
  },
  close: function () {
    this.remove();
  },
  beforeRender: function(){
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

module.exports = BaseView2d;
