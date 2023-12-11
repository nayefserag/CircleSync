const nodemailer = require('nodemailer');
const ejs = require('ejs');
const { readFileSync } = require('fs');
const config = require('../config');
async function MailerConfig(link, recipientEmail, filelocation, subject , name) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });
  const template = ejs.compile(readFileSync(filelocation, 'utf-8'));
  const emailHtml = template({ link , name});
  const mailOptions = {
    from: 'Nayf Serag',
    to: recipientEmail,
    subject: subject,
    html: emailHtml,
  };
  return { transporter, mailOptions };
}
module.exports = {
  MailerConfig
}