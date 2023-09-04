const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v),
      message: "Please enter a valid email",
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationCode: {
    type: String,
  },
  emailVerificationCodeExpiration: {
    type: Date,
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
