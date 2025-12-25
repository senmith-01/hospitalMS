const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create reusable transporter object using the default SMTP transport
    // You should configure these in your .env file
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail', // e.g., 'gmail'
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Hospital App'} <${process.env.FROM_EMAIL || 'noreply@hospitalapp.com'}>`, // sender address
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html // If you want to send HTML emails
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
