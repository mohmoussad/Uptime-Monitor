const Report = require("../models/report.model");
const Check = require("../models/check.model");

const { isValedObjectId } = require("../helpers/helperFunctions");

const getReport = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const reportId = req.params.id;
    if (!isValedObjectId(reportId))
      return res
        .status(400)
        .json({ message: "Not a valid id (Can't be casted to mongo's ObjectId), Check its length" });

    const report = await Report.findOne({ _id: reportId, ownerId });
    if (!report) return res.status(400).json({ message: "No reports with this id" });

    res.json({ report });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Getting Report failed" });
  }
};

const getAllReports = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const tags = req.query?.tags?.split(",");

    const query = { ownerId };
    if (tags && tags.length && tags[0]) {
      query.tags = { $all: tags };
    }

    const checks = await Check.find(query);
    const checksIds = checks.map((check) => check._id.toString());

    const reports = await Report.find({ checkId: { $in: checksIds } }).populate("checkId");

    res.json(reports);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Getting Reports failed" });
  }
};

module.exports = { getReport, getAllReports };
