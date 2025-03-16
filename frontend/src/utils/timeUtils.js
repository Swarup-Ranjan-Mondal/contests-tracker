export const getTimeRemaining = (startTime) => {
    const now = new Date();
    const contestDate = new Date(startTime);
    const diff = contestDate - now;
  
    if (diff <= 0) return "Starts soon!";
  
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
  
    return `Starts in ${days}d ${hours}h ${minutes}m ${seconds}s`;
};
  