import eventController from "../controllers/eventController";
var commandController = require("controllers/commandController");
var GraphModel = require("models/GraphModel");
var BaseModel = require("models/BaseModel");

describe("GraphModel", function () {

  var graphModel = null;

  beforeEach(function () {
    graphModel = new GraphModel();
  });

  afterEach(function () {
    graphModel.removeEventHandlers();
  });

  describe("toJSON", function () {
    it("returns an object", function () {
      var json = graphModel.toJSON();
      expect(json).to.be.an("object");
    });

    it("contains traces", function () {
      var json = graphModel.toJSON();
      expect(json.traces).to.be.an("array");
    });
  });

  describe("export", function () {

    beforeEach(function () {
      graphModel = new GraphModel();
    });

    afterEach(function () {
      graphModel.removeEventHandlers();
    });

    it("return original JSON", function () {
      var parseData = require("./data/SingleTraceTwoNodes");
      graphModel.parseData(parseData);
      var json = graphModel.getData();
      expect(json).to.deep.equal(parseData);
    });

    it("return original source", function () {
      var parseData = require("./data/SingleTraceTwoNodes");
      var originalSource = "TEST";
      graphModel.setSource(originalSource);
      graphModel.parseData(parseData);
      var source = graphModel.getSource();
      expect(source).to.equal(originalSource);
    });

    it("returns transform JSON", function (cb) {
      var parseData = require("./data/SingleTraceTwoNodes");
      graphModel.parseData(parseData);
      graphModel.once(BaseModel.PARSE_END, function () {
        var node1 = graphModel.get("traces").at(0).get("nodes").at(0);
        var node2 = graphModel.get("traces").at(0).get("nodes").at(1);
        node1.x = 100;
        node1.y = 100;
        node2.x = 200;
        node2.y = 200;

        var transforms = graphModel.getGraphTransforms();
        expect(transforms).to.deep.equal({
          traces: [
            {
              nodes: [
                {
                  collapsed: false,
                  hide: false,
                  x: node1.x,
                  y: node1.y,
                },
                {
                  collapsed: false,
                  hide: false,
                  x: node2.x,
                  y: node2.y,
                }
              ]
            }
          ]
        });
        cb();
      });
    });

    it("return WNG JSON", function () {
      var wingJSON = graphModel.toWing();
      expect(wingJSON).to.deep.equal({
        data: {},
        source: "",
        transforms: {
          traces: [],
        },
        selectedTraceIndex: 0,
        timeStamp: new Date()
      });
    });
  });

  describe("parsing", function () {

    var data = require("./data/SingleTraceTwoNodes");

    beforeEach(function () {
      graphModel = new GraphModel();

      spyOn(graphModel, "parseData").and.callThrough();
      spyOn(graphModel, "parseTraceDataChunk").and.callThrough();
      spyOn(graphModel, "parseTrace").and.callThrough();
    });

    afterEach(function () {
      graphModel.removeEventHandlers();
    });

    it("can be stopped", function (cb) {
      graphModel.parseData(data);
      graphModel.stopParseData();
      graphModel.once(BaseModel.PARSE_CANCELED, function () {
        jasmine.expect(graphModel.parseTrace.calls.count()).toEqual(0);
        jasmine.expect(graphModel.parseTraceDataChunk.calls.count()).toEqual(1);
        cb();
      });
    });

    it("starting, stopping, starting a new parse cancels previous", function (cb) {
      graphModel.parseData(data);
      graphModel.stopParseData();
      graphModel.parseData(data);
      graphModel.once(BaseModel.PARSE_END, function () {
        jasmine.expect(graphModel.parseTrace.calls.count()).toEqual(1);
        jasmine.expect(graphModel.parseTraceDataChunk.calls.count()).toEqual(2);
        cb();
      });
    });

    it("starting a new parse cancels previous", function (cb) {
      graphModel.parseData(data);
      graphModel.parseData(data);
      graphModel.once(BaseModel.PARSE_END, function () {
        jasmine.expect(graphModel.parseTrace.calls.count()).toEqual(1);
        jasmine.expect(graphModel.parseTraceDataChunk.calls.count()).toEqual(2);
        cb();
      });
    });

    it("starting 3 new parses cancels all previous", function (cb) {
      _.times(3, function (i) {
        graphModel.parseData(data);
      });
      graphModel.once(BaseModel.PARSE_END, function () {
        jasmine.expect(graphModel.parseTrace.calls.count()).toEqual(1);
        jasmine.expect(graphModel.parseTraceDataChunk.calls.count()).toEqual(3);
        cb();
      });
    });

    it("runningParse true when parsing", function () {
      graphModel.parseData(data);
      expect(graphModel.runningParse()).to.equal(true);
    });

    it("runningParse false when not parsing", function () {
      graphModel.parseData(data);
      graphModel.stopParseData();
      expect(graphModel.runningParse()).to.equal(false);
    });
  });

  describe("event handlers", function () {
    var originalEventControllerEvents = null;
    var originalCommandControllerEvents = null;

    beforeEach(function () {
      originalEventControllerEvents = eventController._events;
      originalCommandControllerEvents = commandController._commands;
      eventController._events = {};
      commandController._commands = {};
      graphModel = new GraphModel();
    });

    afterEach(function () {
      eventController._events = originalEventControllerEvents;
      commandController._commands = originalEventControllerEvents;
    });

    it("no leaks when removed", function () {
      graphModel.removeEventHandlers();
      _.keys(eventController._events).should.have.length(0)
      _.keys(commandController._events).should.have.length(0)
    });
  });
});
