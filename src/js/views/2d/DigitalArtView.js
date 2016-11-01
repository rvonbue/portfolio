import BaseView2d from "./BaseView2d";
import pageData from "../../data/pageData/digitalArt";
import projectContainerHTML from "./DigitalArtViewTemplate.html";

var DigitalArtView = BaseView2d.extend({
  className: "digital-art",
  title: "Digital Art",
  titleTemplate: _.template("<h2 class='section-title'><%= title %></h2><hr class='first'/>"),
  initialize: function () {
    BaseView2d.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    this.$el.append(this.titleTemplate({ title: this.title }));
    _.each(pageData, function (templateData) {
      var newProjectContainer = _.template(projectContainerHTML(templateData));
      this.$el.append(newProjectContainer);
    }, this);
    return this;
  }
});

module.exports = DigitalArtView;
