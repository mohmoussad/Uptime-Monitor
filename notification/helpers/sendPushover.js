const axios = require("axios");
const FormData = require("form-data");

const sendPushover = async (data, message) => {
    const form = new FormData();
    form.append("token", data.token);
    form.append("user", data.userkey);
    form.append("message", message);

  try {
    await axios.post("https://api.pushover.net/1/messages.json", form, {
      headers: {
        ...form.getHeaders(),
      },
    });

  } catch (error) {
    console.error("Error sending Pushover:", error);
  }
};

module.exports = sendPushover;
