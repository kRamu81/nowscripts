import nodemailer from "nodemailer";
import env from "./envalid";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendOTP = async (email: string, name: string, otp: string) => {
  const mailOptions = {
    from: `"NowScripts Team" <${env.SMTP_USER}>`,
    to: email,
    subject: "NowScripts Password Reset",
    text: `Hello ${name},\n\nWe received a request to reset your password.\n\nYour verification code is:\n\n${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this reset, please ignore this email.\n\nRegards,\nNowScripts Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hello ${name},</h2>
        <p>We received a request to reset your password.</p>
        <p>Your verification code is:</p>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px;">
          ${otp}
        </div>
        <p>This code expires in <strong>10 minutes</strong>.</p>
        <p>If you did not request this reset, please ignore this email.</p>
        <br/>
        <p>Regards,<br/>NowScripts Team</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
};
