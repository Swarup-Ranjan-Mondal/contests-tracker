const platformLogos = {
  codeforces: "https://camo.githubusercontent.com/b5f0879162f3fb94fa211b30508d39bfcce3a406883e58e77d27e867204bb76c/68747470733a2f2f6173736574732e636f6465666f726365732e636f6d2f75736572732f6b6775736576612f636f6d6d656e74732f63662e706e67",
  codechef: "https://camo.githubusercontent.com/648cba0c9de41a257af19d2a1cf070a21b99ddf5529c1e16514700dd6b92505b/68747470733a2f2f63646e2e636f6465636865662e636f6d2f73697465732f616c6c2f7468656d65732f61626573736976652f63632d6c6f676f2e706e67",
  leetcode: "https://camo.githubusercontent.com/7a050eb13c50c392a3752f0bd8fdcdf2da8f72a747be90f86221016cc4d35775/68747470733a2f2f63646e2d696d616765732d312e6d656469756d2e636f6d2f6d61782f313630302f312a67426b4d4347544164536b34747531375343613752512e706e67",
};

const getPlatformDisplayName = (platform) =>
  platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase();

const generateEmailTemplate = (user, contest) => `
  <html>
  <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; margin: 0; padding: 40px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 16px rgba(0,0,0,0.1);">
      
      <div style="background-color: #007bff; padding: 20px; text-align: center;">
        <img src="https://raw.githubusercontent.com/Swarup-Ranjan-Mondal/contests-tracker/main/frontend/public/icon.png" alt="Contest Tracker Logo" style="height: 60px;">
      </div>

      <div style="padding: 40px;">
        <h2 style="color: #007bff; margin-top: 0;">Hi ${user.name},</h2>
        <p>Just a quick reminder that your bookmarked contest <strong>"${contest.name}"</strong> on <strong>${getPlatformDisplayName(contest.platform)}</strong> is starting in an hour!</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <img src="${platformLogos[contest.platform.toLowerCase()]}" alt="${getPlatformDisplayName(contest.platform)} Logo" style="height: 80px; border-radius: 8px;">
        </div>
        
        <p>Stay confident, trust your preparation, and give it your best shot. The leaderboard awaits!</p>

        <p style="text-align: center;">
          <a href="${contest.url}" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold; font-size: 16px;">
            Join Contest
          </a>
        </p>
      </div>
    </div>
  </body>
  </html>
`;

export default generateEmailTemplate;
