import nodemailer from "nodemailer";
import Contest from "../../models/Contest.js";
import User from "../../models/User.js";
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
} from "../../config/config.js";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

// Utility function to send emails
const sendReminderEmail = async (user, contest) => {
  try {
    await transporter.sendMail({
      from: SMTP_USER,
      to: user.email,
      subject: `Reminder: Upcoming Contest - ${contest.name}`,
      text: `Hi ${user.name},\n\nReminder: Your bookmarked contest "${contest.name}" on ${contest.platform} starts in an hour!\n\nGood luck!`,
    });
    console.log(`✅ Reminder sent to ${user.email}`);
  } catch (error) {
    console.error(`❌ Error sending reminder to ${user.email}:`, error);
  }
};

const scheduleReminder = async (userId, contestId) => {
  try {
    const [user, contest] = await Promise.all([
      User.findById(userId),
      Contest.findById(contestId),
    ]);

    if (!user || !contest) {
      console.error("❗ User or contest not found");
      return;
    }

    const timeDiff = new Date(contest.startTime) - Date.now();
    if (timeDiff <= 0) {
      console.error("⚠ Contest has already started");
      return;
    }

    const reminderTime = timeDiff - 60 * 60 * 1000;
    if (reminderTime <= 0) {
      console.warn(
        "⏳ Less than 1 hour remaining, sending immediate reminder."
      );
      await sendReminderEmail(user, contest);
      return;
    }

    console.log(
      `⏰ Scheduling reminder for ${user.email} in ${Math.floor(
        reminderTime / 1000
      )} seconds.`
    );
    setTimeout(() => sendReminderEmail(user, contest), reminderTime);
  } catch (error) {
    console.error("❗ Error scheduling reminder:", error);
  }
};

export default scheduleReminder;
