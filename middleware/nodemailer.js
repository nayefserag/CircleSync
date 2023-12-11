const { MailerConfig } = require('../config/nodemailer_config');
async function sendEmailReport(link , recipientEmail, subject, name) {
    const { transporter, mailOptions } = await MailerConfig(link, recipientEmail, './templates/report.ejs', subject , name);
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
module.exports = {
    sendEmailReport
}
