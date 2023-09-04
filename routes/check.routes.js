const router = require("express").Router();
const {
  createCheck,
  getAllChecks,
  getCheck,
  updateCheck,
  deleteCheck,
} = require("../controllers/check.controller");
const auth = require("../middleware/auth");

router.post("/", auth, createCheck);
router.get("/", auth, getAllChecks);
router.get("/:id", auth, getCheck);
router.put("/:id", auth, updateCheck);
router.delete("/:id", auth, deleteCheck);

module.exports = router;