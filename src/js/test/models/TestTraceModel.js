var TraceModel = require("models/TraceModel");
var SingleTraceTwoNodes =  require("./data/SingleTraceTwoNodes").traces[0];
var SharedNodeOutOfOrderTest = require("./data/SharedNodeOutOfOrderTest.json");
var MultipleSharedNodes = require("./data/MultipleSharedNodes.json");
var MultipleCompositesOneBranch = require("./data/MultipleCompositesOneBranch.json");
var MultipleCompositesMaxDepth = require("./data/MultipleCompositesMaxDepth.json");
var SimpleOneRootTwoBranches = require("./data/SimpleOneRootTwoBranches.json");
var SimpleOneRootOneBranch = require("./data/SimpleOneRootOneBranch.json");
var SingleRootComplexSubBranches = require("./data/SingleRootComplexSubBranches.json");
var MultipleCompositesSharedNodes = require("./data/MultipleCompositesSharedNodes.json");
var SampleEmployeeEmployer1 = require("./data/Employee_Employer1.json");
var SampleEmployeeEmployer2 = require("./data/Employee_Employer2.json");

describe("TraceModel", function () {

  describe("parseData", function () {
    it("creates nodes and links", function () {
      var traceModel = new TraceModel();
      traceModel.parseData(SingleTraceTwoNodes);

      expect(traceModel.get("nodes")).to.be.a("object");
      expect(traceModel.get("nodes").length).to.equal(2);
      expect(traceModel.get("links")).to.be.a("object");
      expect(traceModel.get("links").length).to.equal(1);
    });
  });

  describe("generateTrees", function () {

    it("creates trees", function () {
      var traceModel = new TraceModel();
      traceModel.parseData(SingleTraceTwoNodes);
      expect(traceModel.tree).to.exist;
      expect(traceModel.tree.roots.length).to.equal(1);
      expect(traceModel.tree.composites.length).to.equal(0);
      expect(traceModel.getRoots()[0].children.length).to.equal(1);
    });
    it("creates branches", function () {
      var traceModel = new TraceModel();
      traceModel.parseData(SingleTraceTwoNodes);
      expect(traceModel.branchMap).to.exist;
      var branchMap = traceModel.branchMap;
      var firstBranch = branchMap[traceModel.tree.roots[0].rootNode.get("id")];
      expect(firstBranch).to.exist;
      expect(firstBranch.children.length).to.equal(1)
    });
    it("creates single branches when children are related", function () {
      var traceModel = new TraceModel();
      traceModel.parseData(SimpleOneRootOneBranch);
      expect(traceModel.tree.roots[0].subBranches).to.exist;
      expect(traceModel.tree.roots[0].subBranches.length).to.equal(1);
    });
    it("creates multiple branches when children are not related", function () {
      var traceModel = new TraceModel();
      traceModel.parseData(SimpleOneRootTwoBranches);
      expect(traceModel.tree.roots[0].subBranches).to.exist;
      expect(traceModel.tree.roots[0].subBranches.length).to.equal(2);
    });
    it("creates sub branches below composites when children are not related", function () {
      var traceModel = new TraceModel();
      traceModel.parseData(SingleRootComplexSubBranches);
      expect(traceModel.tree.roots[0].subBranches).to.exist;
      expect(traceModel.tree.roots[0].subBranches.length).to.equal(2);
      expect(traceModel.tree.composites[0].subBranches).to.exist;
      expect(traceModel.tree.composites[0].subBranches.length).to.equal(2);

    });
    it("creates branches with children in correct order", function () {
      var traceModel = new TraceModel();
      traceModel.parseData(MultipleSharedNodes);
      var rootNode = traceModel.getRoots()[1].rootNode;
      expect(traceModel.branchToString(rootNode)).to.equal("b -> n -> x -> y -> z");
    });
    it("creates branches with composites in correct order", function () {
      var traceModel = new TraceModel();
      traceModel.parseData(MultipleCompositesOneBranch);
      var rootNode = traceModel.getRoots()[0].rootNode;
      expect(traceModel.branchToString(rootNode)).to.equal("a -> b -> n -> c -> m");
    });

    it("create branch with child nodes in correct order", function () {
      var traceModel = new TraceModel();
      traceModel.parseData(SampleEmployeeEmployer1);
      var employerNode = traceModel.getNodes().at(4);
      expect(traceModel.branchToString(employerNode)).to.equal("Employer -> EmployeeArrival -> ProvideOffice -> Fill_HR_DB -> MedicalCheck -> ProvideComputer -> ReadyToWork");
    });
    it("create branch with child nodes in correct order", function () {
      var traceModel = new TraceModel();
      traceModel.parseData(SampleEmployeeEmployer2);
      var employerNode = traceModel.getNodes().at(4);
      
      expect(traceModel.branchToString(employerNode)).to.equal("Employer -> EmployeeArrival -> Fill_HR_DB -> ProvideOffice -> MedicalCheck -> ProvideComputer -> ReadyToWork");
    });
  });
  describe("getNodeParents", function () {
    var traceModel;
    beforeEach(function () {
      traceModel = new TraceModel();
    });
    it("returns undefined for roots", function () {
      traceModel.parseData(SingleTraceTwoNodes);
      var rootNode = traceModel.getRoots()[0].rootNode;
      expect(traceModel.getNodeParents(rootNode)).to.be.undefined;
    });
    it("returns parent nodes for atoms and composites", function () {
      traceModel.parseData(SingleTraceTwoNodes);
      var rootNode = traceModel.getRoots()[0].rootNode;
      var childNode = traceModel.getRoots()[0].children[0];
      var parentNodes = traceModel.getNodeParents(childNode);
      expect(parentNodes).to.be.a("array");
      expect(parentNodes.length).to.equal(1);
      expect(parentNodes[0]).to.equal(rootNode);
    });
    it("returns undefined for roots using shared nodes", function () {
      traceModel.parseData(SharedNodeOutOfOrderTest);
      var rootNode = traceModel.getRoots()[0].rootNode;
      expect(traceModel.getNodeParents(rootNode)).to.be.undefined;
    });
    it("returns parent nodes for atoms and composites using shared nodes", function () {
      traceModel.parseData(SharedNodeOutOfOrderTest);
      var rootNode = traceModel.getRoots()[0].rootNode;
      var childNode = traceModel.getRoots()[0].children[0];
      var parentNodes = traceModel.getNodeParents(childNode);
      expect(parentNodes).to.be.a("array");
      expect(parentNodes.length).to.equal(3);
      expect(parentNodes[0]).to.equal(rootNode);
    });
  });
  describe("getRootNodes", function () {
    var traceModel;
    beforeEach(function () {
      traceModel = new TraceModel();
    });

    it("return self if this is a root", function () {
      traceModel.parseData(SingleTraceTwoNodes);
      var rootNode = traceModel.getRoots()[0].rootNode;
      expect(traceModel.getRootNodes(rootNode)).to.equal(rootNode);
    });
    it("return root if this is an atom or composite", function () {
      traceModel.parseData(SingleTraceTwoNodes);
      var rootNode = traceModel.getRoots()[0].rootNode;
      var childNode = traceModel.getRoots()[0].children[0];
      expect(traceModel.getRootNodes(childNode)[0]).to.equal(rootNode);
    });
  });
  describe("getMaxNodeDepth", function () {
    var traceModel;
    beforeEach(function () {
      traceModel = new TraceModel();
    });

    it("return zero if this is a root", function () {
      traceModel.parseData(SingleTraceTwoNodes);
      var rootNode = traceModel.getRoots()[0].rootNode;
      expect(traceModel.getMaxNodeDepth(rootNode)).to.equal(0);
    });
    it("return number of parents to root if this is an atom or composite (SingleTraceTwoNodes)", function () {
      traceModel.parseData(SingleTraceTwoNodes);
      var childNode = traceModel.getRoots()[0].children[0];
      expect(traceModel.getMaxNodeDepth(childNode)).to.equal(1);
    });
    it("return number of parents to root if this is an atom or composite (SharedNodeOutOfOrderTest)", function () {
      traceModel.parseData(SharedNodeOutOfOrderTest);
      var yNode = traceModel.getNodes().at(1);
      var zNode = traceModel.getNodes().at(3);
      expect(traceModel.getMaxNodeDepth(yNode)).to.equal(2);
      expect(traceModel.getMaxNodeDepth(zNode)).to.equal(1);
    });
    it("return max number of parents if this is a composite with a composite parent", function () {
      traceModel.parseData(MultipleCompositesMaxDepth);
      var bNode = traceModel.getNodes().at(2);
      var eNode = traceModel.getNodes().at(3);
      var dNode = traceModel.getNodes().at(5);
      expect(traceModel.getMaxNodeDepth(bNode)).to.equal(2);
      expect(traceModel.getMaxNodeDepth(eNode)).to.equal(3);
      expect(traceModel.getMaxNodeDepth(dNode)).to.equal(5);
    });
    it("return max number of parents if this is a composite with a composite parent and shared nodes", function () {
      traceModel.parseData(MultipleCompositesSharedNodes);
      var bNode = traceModel.getNodes().at(3);
      var cNode = traceModel.getNodes().at(1);
      var dNode = traceModel.getNodes().at(4);
      var eNode = traceModel.getNodes().at(5);
      var fNode = traceModel.getNodes().at(6);

      expect(traceModel.getMaxNodeDepth(bNode)).to.equal(1);
      expect(traceModel.getMaxNodeDepth(cNode)).to.equal(1);
      expect(traceModel.getMaxNodeDepth(dNode)).to.equal(2);
      expect(traceModel.getMaxNodeDepth(eNode)).to.equal(3);
      expect(traceModel.getMaxNodeDepth(fNode)).to.equal(4);
    });
  });

  describe("getMaxBranchingWidth", function () {
    it("returns the maximum branch width for a given node", function () {
      var traceModel = new TraceModel();
      traceModel.parseData(MultipleCompositesSharedNodes);
      var aNode = traceModel.getNodes().at(0);
      var zNode = traceModel.getNodes().at(7);
      var xNode = traceModel.getNodes().at(9);

      expect(traceModel.getMaxBranchingWidth(aNode)).to.equal(2);
      expect(traceModel.getMaxBranchingWidth(xNode)).to.equal(2);
      expect(traceModel.getMaxBranchingWidth(zNode)).to.equal(3);
    });
    it("returns branch width 1 for SampleEmployeeEmployer1", function () {
      var traceModel = new TraceModel();
      traceModel.parseData(SampleEmployeeEmployer1);
      var employerNode = traceModel.getNodes().at(4);
      console.log(employerNode);
      expect(traceModel.getMaxBranchingWidth(employerNode)).to.equal(1);
    });
    it("returns branch width 1 for SampleEmployeeEmployer2", function () {
      var traceModel = new TraceModel();
      traceModel.parseData(SampleEmployeeEmployer2);
      var employerNode = traceModel.getNodes().at(4);
      console.log(employerNode);
      expect(traceModel.getMaxBranchingWidth(employerNode)).to.equal(1);
    });
  })
});
