import BaseView2d from "./BaseView2d";
// import pageData from "../../data/pageData/3dAnimation";
import ThreeDAnimationHTML from "./ThreeDAnimationViewTemplate.html";

var ThreeDAnimationView = BaseView2d.extend({
  className: "3d-animation",
  title: "3D Animation",
  titleTemplate: _.template("<h2 class='section-title'><%= title %></h2><hr class='first'/>"),
  initialize: function () {
    BaseView2d.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    this.$el.append(this.titleTemplate({ title: this.title }));
    this.$el.append(ThreeDAnimationHTML);
    return this;
  }
});

module.exports = ThreeDAnimationView;
