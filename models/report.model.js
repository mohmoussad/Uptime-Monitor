const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  checkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Check",
  },
  status: {
    type: String,
    default: "",
  },
  availability: {
    type: String,
    default: "",
  },
  outages: {
    type: Number,
    default: 0,
  },
  downtime: {
    type: Number,
    default: 0,
  },
  uptime: {
    type: Number,
    default: 0,
  },
  responseTime: {
    type: Number,
    default: 0,
  },
  history: [{ timestamp: Date, up: Boolean, statusCode: String, statusText: String, responseTime: Number }],
});


const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
