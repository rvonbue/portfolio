import BaseView2d from "./BaseView2d";
import pageData from "../../data/pageData/digitalArt";
import AboutMeViewHTML from "./AboutMeView.html";

var AboutMeView = BaseView2d.extend({
  className: "about-me",
  title: "Skills/Resume",
  titleTemplate: _.template("<h2 class='section-title'><%= title %></h2><hr class='first'/>"),
  initialize: function () {
    BaseView2d.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    this.$el.append(this.titleTemplate({ title: this.title }));
    this.$el.append(AboutMeViewHTML);
    return this;
  }
});

module.exports = AboutMeView;
