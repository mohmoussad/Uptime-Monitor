const router = require("express").Router();
const userRouter = require("./routes/user.routes");
const reportRouter = require("./routes/report.routes");
const checkRouter = require("./routes/check.routes");

router.get("/", (req, res) => {
  res.json({ message: "Up and Running" });
});

router.use("/user", userRouter);
router.use("/check", checkRouter);
router.use("/report", reportRouter);



module.exports = router;
