const Check = require("../models/check.model");
const Report = require("../models/report.model");
const { isValedObjectId } = require("../helpers/helperFunctions");
const monitor = require("../monitor/monitor");

const createCheck = async (req, res) => {
  let {
    name,
    url,
    protocol,
    path,
    port,
    webhook,
    timeout,
    interval,
    threshold,
    authentication,
    pushover,
    httpHeaders,
    assert,
    tags,
    ignoreSSL,
  } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });
  if (!url) return res.status(400).json({ message: "URL is required" });
  if (!protocol) return res.status(400).json({ message: "Protocol is required" });
  if (!pushover?.userkey || !pushover?.token) return res.status(400).json({ message: "Pushover userkey and token are required" });
    if (ignoreSSL == undefined && protocol == "https")
      return res.status(400).json({
        message:
          "In case of https protocals it's required to choose whether to ignore broken/expired SSL certificates or not",
      });

  try {
    /*
      In this part, I'm trying to check if there is a check that already exists in the database with the same parameters as the new request.
      It didn't work as expected in the beginning because of the httpHeaders field; it needs deep comparison (array of objects).
      I tried different approaches:
      - $elem
      - $all
      - Virtual middleware 
      Finally, I used JSON.stringify() for the deep comparison goal.
      I find all checks with the same parameters as the new request, and then I filter these checks depending on the deep comparison.
    */
    let checks = await Check.find(
      {
        ownerId: req.user._id,
        name,
        url,
        protocol,
        path,
        port,
        webhook,
        timeout,
        interval,
        threshold,
        pushover,
        authentication,
        assert,
        tags,
        ignoreSSL,
      },
      { "httpHeaders._id": 0 }
    );
    checks = checks.filter((check) => {
      return JSON.stringify(check.httpHeaders) == JSON.stringify(httpHeaders);
    });

    if (checks.length)
      return res.status(400).json({ message: "You checked for this URL with the same parameters before" });

    const newCheck = await Check.create({
      ownerId: req.user._id,
      name,
      url,
      protocol,
      path,
      port,
      webhook,
      timeout,
      interval,
      threshold,
      pushover,
      authentication,
      httpHeaders,
      assert,
      tags,
      ignoreSSL,
    });

    if (newCheck) {
      const newReport = await Report.create({ ownerId: req.user._id, checkId: newCheck._id });
      monitor(newCheck._id, newReport);
      return res.json({
        message: `New check on URL:${newCheck.url}, Check Id: ${newCheck._id}, Report Id: ${newReport._id}`,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Creating new check failed" });
  }
};

const getAllChecks = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const tags = req.query?.tags?.split(",");
    
    const query = { ownerId };
    if (tags && tags.length && tags[0]) {
      query.tags = { $all: tags };
    }

    const checks = await Check.find(query);

    res.json(checks);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Getting Reports failed" });
  }
};

const getCheck = async (req, res) => {
  try {
    const checkId = req.params.id;

    if (!isValedObjectId(checkId))
      return res
        .status(400)
        .json({ message: "Not a valid id (Can't be casted to mongo's ObjectId), Check its length" });

    const check = await Check.findById(checkId);
    if (!check) return res.status(400).json({ message: "You don't have checks yet" });

    res.json({ check });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Getting Check failed" });
  }
};

const updateCheck = async (req, res) => {
  try {
    const checkToUpdateId = req.params.id;
    const checkUpdateBody = req.body;

    if (!isValedObjectId(checkToUpdateId))
      return res
        .status(400)
        .json({ message: "Not a valid id (Can't be casted to mongo's ObjectId), Check its length" });

    const check = await Check.findById(checkToUpdateId);
    if (!check) return res.status(400).json({ message: "No check with this id" });

    const report = await Report.findOne({ checkId: check._id });
    if (!report) return res.status(400).json({ message: "No report with this id" });

    Object.assign(check, checkUpdateBody);
    const updatedCheck = await check.save();

    res.json({
      message: `Your check on (${updatedCheck.name}) is updated, Check Id is ${updatedCheck._id}, Report Id: ${report._id}`,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Updating Check failed" });
  }
};

const deleteCheck = async (req, res) => {
  try {
    const checkTobeDeletedId = req.params.id;

    if (!isValedObjectId(checkTobeDeletedId))
      return res
        .status(400)
        .json({ message: "Not a valid id (Can't be casted to mongo's ObjectId), Check its length" });

    const check = await Check.findById(checkTobeDeletedId);
    if (!check) return res.status(400).json({ message: "No check with this id" });

    const report = await Report.findOne({ checkId: check._id });
    if (!report) return res.status(400).json({ message: "No report with this id" });

    await Check.findByIdAndDelete(check._id);
    await Report.findByIdAndDelete(report._id);

    res.json({ message: `Check (${check._id}) and Report (${report._id}) are deleted` });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Deleting Check failed" });
  }
};

module.exports = {
  createCheck,
  getAllChecks,
  getCheck,
  updateCheck,
  deleteCheck,
};
