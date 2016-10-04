import eventController from "../../controllers/eventController";
import DatGui from "dat-gui";


var DatGuiView = Backbone.View.extend({
  className: "dat-gui",
  initialize: function () {
    eventController.on(eventController.ADD_DAT_GUI_CONTROLLER, this.addController, this);
    var FizzyText = function() {
      this.message = 'dat.gui';
      this.speed = 0.8;
      this.displayOutline = false;
      // Define render logic ...
    };
    var text = new FizzyText();
    this.gui = new DatGui.GUI();
    this.gui.add(text, 'message');
    this.gui.add(text, 'speed', -5, 5);
    this.gui.add(text, 'displayOutline');
  },
  addController: function (obj) {
    var rangeMax = 50;
    var rangeMin = 0;
    _.each(obj.arr, function (a, i) {
        this.gui.add(a, obj.key, rangeMin , rangeMax).name(obj.name + " " + i).listen();
    }, this);
  },
  render: function () {
    this.$el.append(this.gui.domElement);
    return this;
  }
});
module.exports = DatGuiView;
