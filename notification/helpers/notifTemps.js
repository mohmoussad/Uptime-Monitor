module.exports = {
  verificationNotifTemp: (data) => {
    const verificationURL = `${process.env.SERVER_URL}/api/user/verify/${data.emailVerificationCode}`;
    return {
      subject: "Please verify your email",
      text: `Welcome to Uptime Monitor service, You can verify your email through this link ${verificationURL}, Please note that it will expire in 1 day`,
    };
  },
  thresholdNotifTemp: (data) => {
    return {
      subject: `ALERT: ${data.url}`,
      text: `Your check on ${data.url} has passed the threshold of failed requests (Your threshold is: ${data.threshold})`,
    };
  },
};
