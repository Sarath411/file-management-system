const nodemailer = require("nodemailer");

export const sendEmail = async ({ userMails, subject, text }: any) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.AWS_SES_HOST,
      port: process.env.AWS_SES_PORT,
      secure: false,
      auth: {
        user: process.env.AWS_SES_USER,
        pass: process.env.AWS_SES_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.senderEmail,
      to: userMails.join(","),
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
