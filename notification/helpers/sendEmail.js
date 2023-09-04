const { transporter } = require("../../config/nodemailer");

const sendEmail = (email, subject, text) => {
  const mailOptions = {
    from: `Uptime Monitor Service <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject,
    text,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
  });
};

module.exports = sendEmail;
