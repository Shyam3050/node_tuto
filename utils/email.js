const nodemailer = require("nodemailer");

const sendEmail = (option) => {
  // create a trasnporter
  const config = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    secure: false,
  };
  console.log(config);
  const transporter = nodemailer.createTransport(config);

  // define email option
  const mailOptions = {
    from: "<to@example.com>",
    to: "<to@example.com>",
    subject: option.subject,
    text: option.message,
  };
  console.log(mailOptions);

  // send email with nodemailer
  transporter.sendMail(mailOptions)
};

module.exports = sendEmail;
