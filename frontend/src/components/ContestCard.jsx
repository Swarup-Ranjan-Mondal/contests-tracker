import { useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";

const ContestCard = ({ contest, isPast = false }) => {
  const [timeInfo, setTimeInfo] = useState(getTimeInfo(contest.startTime, isPast));

  useEffect(() => {
    if (!isPast) {
      const interval = setInterval(() => {
        setTimeInfo(getTimeInfo(contest.startTime, isPast));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [contest.startTime, isPast]);

  function getTimeInfo(startTime, isPast) {
    const now = new Date();
    const contestDate = new Date(startTime);
    const diffMs = now - contestDate; // Difference in milliseconds

    if (isPast) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes < 60) return "A few minutes ago";
      if (diffHours < 24) return `${diffHours} hours ago`;
      return `Happened ${diffDays} days ago`;
    }

    const futureDiff = contestDate - now;
    if (futureDiff <= 0) return "Starts soon!";

    const days = Math.floor(futureDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((futureDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((futureDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((futureDiff / 1000) % 60);

    return `Starts in ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow-md text-white">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{contest.name}</h3>
        <CalendarDays size={22} className="text-gray-400" />
      </div>
      <p className="text-gray-400 mt-1">{contest.platform}</p>
      <p className="text-gray-300 mt-2">{new Date(contest.startTime).toLocaleString()}</p>

      <div className="flex items-center mt-4 text-blue-400 font-semibold">
        <Clock size={20} className="mr-2" />
        <span>{timeInfo}</span>
      </div>
    </div>
  );
};

export default ContestCard;
