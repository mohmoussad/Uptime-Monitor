const User = require("../models/user.model");
const { notifTemps, sendEmail, sendWebhook, sendPushover } = require("./helpers");


const notify = async (type, data) => {
  if (type == "mailVerification") {
    const { subject, text } = notifTemps.verificationNotifTemp(data);
    sendEmail(data.email, subject, text);
  } else if (type == "thresholdPassed") {
    const owner = await User.findById(data.ownerId);
    const { subject, text } = notifTemps.thresholdNotifTemp(data);
    sendEmail(owner.email, subject, text);
    sendWebhook(data.webhook, text);
    sendPushover(data.pushover, text);

  }
};

module.exports = notify;
