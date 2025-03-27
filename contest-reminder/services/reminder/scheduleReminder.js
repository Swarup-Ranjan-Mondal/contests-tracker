import Contest from "../../models/Contest.js";
import User from "../../models/User.js";
import sendEmail from "../email/sendEmail.js";

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

    const contestStartTime = new Date(contest.startTime).getTime();
    const currentTime = Date.now();
    const timeDiff = contestStartTime - currentTime;

    if (timeDiff <= 0) {
      console.error("⚠ Contest has already started");
      return;
    }

    const reminderTime = timeDiff - 60 * 60 * 1000;
    if (reminderTime <= 0) {
      console.warn(
        "⏳ Less than 1 hour remaining, sending immediate reminder."
      );
      await sendEmail(user, contest);
      return;
    }

    console.log(
      `⏰ Scheduling reminder for ${user.email} in ${Math.floor(
        reminderTime / 1000
      )} seconds.`
    );
    setTimeout(() => sendEmail(user, contest), reminderTime);
  } catch (error) {
    console.error("❗ Error scheduling reminder:", error);
  }
};

export default scheduleReminder;
