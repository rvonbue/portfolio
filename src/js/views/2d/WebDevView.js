import BaseView2d from "./BaseView2d";
import pageData from "../../data/pageData/WebDevProjects";
import projectContainerHTML from "./WebDevViewTemplate.html";

var WebDevView2d = BaseView2d.extend({
  className: "web-dev",
  title: "Web Development",
  titleTemplate: _.template("<h2 class='section-title'><%= title %></h2><hr class='first'/>"),
  initialize: function () {
    BaseView2d.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    this.$el.append(this.titleTemplate({ title: this.title }));

    _.each(pageData, function (templateData, i) {
      var newProjectContainer = _.template(projectContainerHTML(templateData));
      this.$el.append(newProjectContainer);
      if (i !== pageData.length -1) this.$el.append("<hr/>");
    }, this);
    return this;
  }
});

module.exports = WebDevView2d;
