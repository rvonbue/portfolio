import BaseView from "../BaseView";
import webDevData from "../../data/pageData/WebDevProjects";
import projectContainerHTML from "./component/WebDevViewTemplate.html";

var WebDevView2d = BaseView.extend({
  className: "web-dev",
  title: "Web Development",
  titleTemplate: _.template("<h2 class='section-title'><%= title %></h2>"),
  initialize: function () {
    BaseView.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    this.$el.append(this.titleTemplate({ title: this.title }));
    this.$el.append("<hr class='first'/>");
    _.each(webDevData, function (templateData) {
      var newProjectContainer = _.template(projectContainerHTML(templateData));
      this.$el.append(newProjectContainer);
    }, this);
    return this;
  }
});

module.exports = WebDevView2d;
