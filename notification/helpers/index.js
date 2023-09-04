const notifTemps = require("./notifTemps");
const sendEmail = require("./sendEmail");
const sendWebhook = require("./sendWebhook");
const sendPushover = require("./sendPushover");

module.exports = {
  notifTemps,
  sendEmail,
  sendWebhook,
  sendPushover,
};
