const mongoose = require("mongoose");

const checkSchema = mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
    lowercase: true,
  },
  protocol: {
    type: String,
    enum: ["http", "https", "tcp"],
    required: true,
  },
  path: {
    type: String,
  },
  port: {
    type: String,
  },
  webhook: {
    type: String,
  },
  timeout: {
    type: Number,
    default: 5000,
  },
  interval: {
    type: Number,
    default: 600000,
  },
  threshold: {
    type: Number,
    default: 1,
  },
  authentication: {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  pushover: {
    userkey: {
      type: String,
    },
    token: {
      type: String,
    },
  },
  httpHeaders: [
    {
      key: {
        type: String,
      },
      value: {
        type: String,
      },
    },
  ],
  assert: {
    statusCode: {
      type: Number,
    },
  },
  tags: {
    type: [String],
  },
  ignoreSSL: {
    type: Boolean,
    required: function () {
      return this.protocol === "https"; // Make required for https protocol only
    },
  },
});

checkSchema.pre("validate", function (next) {
  const httpHeaders = this.httpHeaders;

  if (!httpHeaders.length) next();

  const hasInvalidHeaders = httpHeaders.some((header) => !header.key || !header.value);

  if (hasInvalidHeaders) {
    const error = new Error("Each entry in httpHeaders array must have both key and value");
    error.name = "ValidationError";
    return next(error);
  }

  next();
});

checkSchema.pre("validate", function (next) {
  const pushover = this.pushover;

  if (!pushover) next();

  if (!pushover.userkey || !pushover.token) {
    const error = new Error("Pushover userkey and token are required");
    error.name = "ValidationError";
    return next(error);
  }
  next();
});

checkSchema.virtual("stringHttpHeaders").get(function () {
  return JSON.stringify(this.httpHeaders);
});

const Check = mongoose.model("Check", checkSchema);

module.exports = Check;
