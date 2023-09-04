const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { emailVerificationCodeExpirationDuration } = require("../helpers/constants");
const notify = require("../notification/notify");

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!password) return res.status(400).json({ message: "Password is required" });

  try {
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "This email is used before" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const emailVerificationCode = uuidv4();
    const emailVerificationCodeExpiration = Date.now() + emailVerificationCodeExpirationDuration;

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      emailVerificationCode,
      emailVerificationCodeExpiration,
    });

    if (newUser) {
      notify("mailVerification", newUser);
      return res.json({ message: "You will receive a verification mail, Please note that it will expire in 1 day" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Signup failed" });
  }
};

const verifyEmail = async (req, res) => {
  const { emailVerificationCode } = req.params;
  if (!emailVerificationCode) return res.status(400).json({ message: "Email verification code is missed" });

  try {
    const user = await User.findOne({ emailVerificationCode });
    if (!user) return res.status(400).json({ message: "Wrong email verification code" });

    if (user.isEmailVerified) return res.status(400).json({ message: "Your email is already verified" });

    if (Date.now() < user.emailVerificationCodeExpiration) {
      user.isEmailVerified = true;
      user.save();
      return res.json({ message: "Your email is verified successfully" });
    } else {
      return res.status(400).json({ message: "Verification link is expired" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Verification failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!password) return res.status(400).json({ message: "Password is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Wrong email" });

    const isCorrectPassword = bcrypt.compareSync(password, user.password);
    if (!isCorrectPassword) return res.status(400).json({ message: "Password is incorrect" });

    if (!user.isEmailVerified) return res.status(400).json({ message: "Your email isn't verified" });

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "3d",
    });

    return res
      .json({ message: "Logged in successfully", token, user: { userId: user._id, name: user.name, email: user.email } });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Login failed" });
  }
};

module.exports = { signup, login, verifyEmail };
