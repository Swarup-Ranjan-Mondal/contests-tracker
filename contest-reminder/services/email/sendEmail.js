import transporter from "../../utils/emailConfig.js";
import generateEmailTemplate from "../../utils/emailTemplates.js";

const sendEmail = async (user, contest) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: user.email,
      subject: `Reminder: Upcoming Contest - ${contest.name}`,
      html: generateEmailTemplate(user, contest),
    });
    console.log(`✅ Reminder sent to ${user.email}`);
  } catch (error) {
    console.error(`❌ Error sending reminder to ${user.email}:`, error);
  }
};

export default sendEmail;
