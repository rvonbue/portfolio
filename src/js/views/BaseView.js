var BaseView = Backbone.View.extend({
  childViews: [],
  initialize: function(){
    this.childViews = new Array();
  },
  hide: function () {
    this.$el.fadeOut();
    // this.removeListeners();
    // this.removeChildViewEventHandlers();
    this.parentEl.removeClass(this.parentClass);
  },
  show: function () {
    this.$el.fadeIn();
    // this.addListeners();
    // this.addChildViewEventHandlers();
    this.parentEl.addClass(this.parentClass);
  },
  // addChildViewEventHandlers: function () {
  //   _.each(this.childViews, function(childView){
  //     console.log("chidldView: ", childView);
  //     childView.view.addListeners();
  //   }, this);
  // },
  // removeChildViewEventHandlers: function() {
  //   _.each(this.childViews, function(childView){
  //     childView.removeListeners();
  //   }, this);
  // }
});

module.exports = BaseView;
