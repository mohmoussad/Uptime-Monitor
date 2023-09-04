const router = require("express").Router();
const {
  getReport,
  getAllReports
} = require("../controllers/report.controller");
const auth = require("../middleware/auth");

router.get("/:id", auth, getReport);
router.get("/", auth, getAllReports);

module.exports = router