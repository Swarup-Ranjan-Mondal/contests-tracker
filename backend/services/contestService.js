import fetchAllContests from '../scrapers/fetchAllContests.js';

export const startContestUpdater = () => {
  // Run scrapers every 6 hours
  setInterval(fetchAllContests, 6 * 60 * 60 * 1000);
  fetchAllContests(); // Run once at startup
};
