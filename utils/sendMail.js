const nodeMailer = require("nodemailer");

const sendEMail = async (options) => {
  const { email, subject, message } = options;

  const transporter = nodeMailer.createTransport({
    // service: process.env.SERVICE,
    host: process.env.GMAIL_HOST,
    port: process.env.GMAIL_PORT,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailoption = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    text: message,
  };

  await transporter.sendMail(mailoption);
};

module.exports = sendEMail;
