const router = require("express").Router();
const {signup, login, verifyEmail} = require('../controllers/user.controller')

router.post("/signup", signup);

router.get("/verify/:emailVerificationCode", verifyEmail);

router.post("/login", login);


module.exports = router;
