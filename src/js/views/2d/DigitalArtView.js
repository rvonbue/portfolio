import BaseView2d from "./BaseView2d";
import pageData from "../../data/pageData/digitalArt";
import projectContainerHTML from "./digitalArtViewTemplate.html";

var DigitalArtView = BaseView2d.extend({
  className: "digital-art",
  title: "Digital Art",
  titleTemplate: _.template("<h2 class='section-title'><%= title %></h2><hr class='first'/>"),
  initialize: function () {
    BaseView2d.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    this.$el.append(this.titleTemplate({ title: this.title }));
    console.log("pageData", pageData);
    _.each(pageData, function (templateData) {
      // var newProjectContainer = _.template(projectContainerHTML(templateData));
      this.$el.append(_.template(projectContainerHTML(templateData)));
      // if (i !== pageData.length -1) this.$el.append("<hr/>");
    }, this);
    return this;
  }
});

module.exports = DigitalArtView;
