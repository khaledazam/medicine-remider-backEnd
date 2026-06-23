
import nodemailer from "nodemailer";

/**
 * @param {string} email - البريد الإلكتروني للمستخدم
 * @param {string} subject - عنوان الإشعار
 * @param {string} message - نص الإشعار
 */
export const sendNotification = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Medicine Reminder" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text: message,
    });

    console.log(" Notification sent to:", email);
  } catch (error) {
    console.error(" Error sending notification:", error.message);
  }
};
