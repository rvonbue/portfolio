import BaseView2d from "./BaseView2d";
import pageData from "../../data/pageData/digitalArt";
import ContactViewHTML from "./contactView.html";

var ContactView = BaseView2d.extend({
  className: "contact",
  title: "Contact Info",
  initialize: function () {
    BaseView2d.prototype.initialize.apply(this, arguments);
  },
  render: function () {
    this.$el.append(this.titleTemplate({ title: this.title }));
    this.$el.append(ContactViewHTML);
    return this;
  }
});

module.exports = ContactView;
