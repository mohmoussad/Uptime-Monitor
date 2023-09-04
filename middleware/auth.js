const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = async (req, res, next) => {
  if (!req.headers.authorization)
    return res.status(400).json({ message: "Unauthorized, No token is provided" });
  let token = req.headers.authorization;

  token = token.split(" ")[1];
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(400).json({ message: "Invalid token" });

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Token verification failed" });
  }
};

module.exports = auth;
