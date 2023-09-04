const axios = require("axios");

const sendWebhook = async (webhookUrl, message) => {
  const payload = {};
  if (webhookUrl.includes("slack")) {
    payload.text = message;
  } else if (webhookUrl.includes("discord")) {
    payload.content = message;
  } else {
    // Needs better handling
    payload.message = message;
  }

  try {
    await axios.post(webhookUrl, payload);
  } catch (error) {
    console.error("Error sending webhook:", error);
  }
};

module.exports = sendWebhook;
