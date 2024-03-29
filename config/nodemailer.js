const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASS,
  },
});

const mailServerCheck = () => {
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Server is ready");
    }
  });
};


module.exports = { transporter, mailServerCheck };
