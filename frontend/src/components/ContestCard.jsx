import { useEffect, useState, useContext } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import AuthContext from "../context/AuthContext";

const ContestCard = ({ contest, isPast = false, isBookmarked = false }) => {
  const { user } = useContext(AuthContext);

  const [timeInfo, setTimeInfo] = useState(
    getTimeInfo(contest.startTime, isPast)
  );
  const [bookmarked, setBookmarked] = useState(isBookmarked);

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
    const diffMs = now - contestDate;

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

  const handleBookmark = async () => {
    const method = bookmarked ? "DELETE" : "POST";

    try {
      const response = await fetch(`/api/contests/bookmark`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ contestId: contest._id, userId: user.id }),
      });

      if (response.ok) {
        setBookmarked(!bookmarked);
      } else {
        console.error("Failed to update bookmark:", await response.json());
      }
    } catch (error) {
      console.error("Failed to update bookmark:", error);
    }
  };

  return (
    <div className="bg-gray-800 p-5 rounded-xl shadow-md text-white">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{contest.name}</h3>
        <div className="flex items-center gap-3">
          <CalendarDays size={22} className="text-gray-400" />
          <button onClick={handleBookmark} className="text-2xl text-yellow-400">
            {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        </div>
      </div>

      <p className="text-gray-400 mt-1">{contest.platform}</p>
      <p className="text-gray-300 mt-2">
        {new Date(contest.startTime).toLocaleString()}
      </p>

      <div className="flex items-center mt-4 text-blue-400 font-semibold">
        <Clock size={20} className="mr-2" />
        <span>{timeInfo}</span>
      </div>

      {isPast && contest.youtube_url && (
        <div className="mt-4">
          <a
            href={contest.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold"
          >
            <FaYoutube size={20} /> Watch Solution
          </a>
        </div>
      )}
    </div>
  );
};

export default ContestCard;
