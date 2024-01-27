const nodemailer = require("nodemailer");

export const sendEmail = async ({ userMails, subject, text }: any) => {
  try {
    // Configure Nodemailer with your SES credentials
    const transporter = nodemailer.createTransport({
      host: process.env.AWS_SES_HOST, // Replace with your SES region
      port: process.env.AWS_SES_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.AWS_SES_USER, // Use environment variables for security
        pass: process.env.AWS_SES_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.senderEmail,
      to: userMails.join(","), // Join array of emails into a single string
      subject: subject,
      text: text,
    };

    // Send email
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error in sending email:", error);
  }
};

// // Usage example
// sendEmail({
//   senderEmail: 'youremail@example.com', // Your verified AWS SES email
//   userMails: ['user1@example.com', 'user2@example.com'], // Array of user emails
//   subject: 'Test Email',
//   text: 'This is a test email sent from Node.js using AWS SES',
// });
